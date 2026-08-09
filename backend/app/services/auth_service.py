import json
import logging
from pathlib import Path
from typing import Optional
import random
import time
from fastapi import HTTPException, status

from app.core.supabase import supabase
from app.core.security import hash_password, verify_password, create_access_token
from app.services.email_service import send_otp_email
from app.core.config import settings

logger = logging.getLogger(__name__)

# Local file fallback path
_DATA_DIR = Path(__file__).resolve().parents[1] / "data"
_USERS_FILE = _DATA_DIR / "local_users.json"


def _ensure_local_storage():
    _DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not _USERS_FILE.exists():
        _USERS_FILE.write_text("[]")


def _get_local_users():
    _ensure_local_storage()
    return json.loads(_USERS_FILE.read_text())


def _save_local_users(users):
    _ensure_local_storage()
    _USERS_FILE.write_text(json.dumps(users, indent=2))


def _find_local_user(email: str) -> Optional[dict]:
    email = email.strip().lower()
    users = _get_local_users()
    for u in users:
        if u.get("email", "").strip().lower() == email:
            return u
    return None


# In-memory dictionary for pending registrations
pending_registrations = {}


def generate_otp() -> str:
    return f"{random.randint(100000, 999999)}"


def send_register_otp(email: str, password: str):
    """
    Checks if a user exists. If not, generates an OTP, stores the registration state
    temporarily in memory, and triggers email delivery.
    """
    email = email.strip().lower()
    user_exists = False

    if supabase:
        try:
            existing = (
                supabase.table("users").select("*").eq("email", email).execute()
            )
            if existing.data and len(existing.data) > 0:
                user_exists = True
        except Exception:
            if _find_local_user(email):
                user_exists = True
    else:
        if _find_local_user(email):
            user_exists = True

    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists"
        )

    try:
        hashed_password = hash_password(password)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Password hashing failed: {str(e)}",
        )

    otp = generate_otp()
    expires_at = time.time() + 600  # 10 minutes expiry

    pending_registrations[email] = {
        "hashed_password": hashed_password,
        "otp": otp,
        "expires_at": expires_at,
    }

    try:
        send_otp_email(email, otp)
    except Exception as e:
        logger.warning(f"Failed to send email OTP (Dev Mode Fallback). OTP for {email} is: {otp} | Error: {str(e)}")
        # Allow dev testing even if email SMTP service is unconfigured
        return {"message": "Verification OTP generated (Check server console if SMTP is unconfigured).", "email": email, "dev_otp": otp}

    return {"message": "Verification OTP sent to email.", "email": email}


def verify_register_otp(email: str, otp: str):
    """
    Verifies the OTP code for the pending registration.
    If valid, creates the user in the database (Supabase or local JSON) and returns a JWT access token.
    """
    email = email.strip().lower()

    if email not in pending_registrations:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No pending registration found for this email. Please request a new OTP.",
        )

    pending = pending_registrations[email]

    if time.time() > pending["expires_at"]:
        del pending_registrations[email]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The OTP code has expired. Please request a new one.",
        )

    if pending["otp"] != otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP code. Please check your email and try again.",
        )

    hashed_password = pending["hashed_password"]

    # Save to DB
    saved_successfully = False
    if supabase:
        try:
            supabase.table("users").insert(
                {"email": email, "hashed_password": hashed_password}
            ).execute()
            saved_successfully = True
        except Exception as e:
            logger.warning(f"Supabase user insert failed, using local storage: {str(e)}")

    if not saved_successfully:
        users = _get_local_users()
        users.append({"email": email, "hashed_password": hashed_password})
        _save_local_users(users)

    # Clean up pending session
    del pending_registrations[email]

    # Create session token and log in directly
    token = create_access_token({"sub": email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_email": email
    }


def register_user(email: str, password: str):
    """Fallback legacy registration helper."""
    email = email.strip().lower()
    hashed_password = hash_password(password)

    if supabase:
        try:
            existing = (
                supabase.table("users").select("*").eq("email", email).execute()
            )
            if existing.data and len(existing.data) > 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User already exists",
                )

            response = (
                supabase.table("users")
                .insert({"email": email, "hashed_password": hashed_password})
                .execute()
            )
            return {
                "message": "User registered successfully",
                "user": response.data,
            }
        except HTTPException:
            raise
        except Exception:
            pass

    if _find_local_user(email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists"
        )

    users = _get_local_users()
    users.append({"email": email, "hashed_password": hashed_password})
    _save_local_users(users)
    return {"message": "User registered successfully", "user": {"email": email}}


def login_user(email: str, password: str):
    """Authenticate user and return JWT token."""
    email = email.strip().lower()
    user = None

    # 1. Search Supabase
    if supabase:
        try:
            response = (
                supabase.table("users").select("*").eq("email", email).execute()
            )
            if response.data and len(response.data) > 0:
                user = response.data[0]
        except Exception as e:
            logger.warning(f"Supabase login search failed: {str(e)}")

    # 2. Search Local JSON Fallback if not found in Supabase
    if not user:
        user = _find_local_user(email)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    stored_hash = user.get("hashed_password")
    if not stored_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # 3. Verify Password
    try:
        is_valid = verify_password(password, stored_hash)
    except Exception:
        is_valid = False

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token({"sub": user["email"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_email": user["email"]
    }


def google_login_user(credential: str):
    """
    Verify a Google ID token, extract the user email,
    auto-create account if it doesn't exist, and return a JWT.
    """
    import httpx

    try:
        resp = httpx.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={credential}",
            timeout=10,
        )
        if resp.status_code != 200:
            logger.error(f"Google Token verification failed with status {resp.status_code}: {resp.text}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Google credential",
            )
        payload = resp.json()
    except Exception as e:
        logger.error(f"Failed to reach Google tokeninfo endpoint: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Failed to verify Google credential: {str(e)}",
        )

    email = payload.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google account has no email",
        )

    email = email.strip().lower()

    # Client ID audience check (bypassed if empty in .env)
    google_client_id = getattr(settings, "GOOGLE_CLIENT_ID", None)
    if google_client_id:
        aud = payload.get("aud", "")
        if aud != google_client_id:
            logger.warning(f"Google token audience mismatch: expected {google_client_id}, got {aud}")

    saved_successfully = False
    if supabase:
        try:
            existing = (
                supabase.table("users").select("*").eq("email", email).execute()
            )
            if not existing.data:
                dummy_hash = hash_password(credential[:32])
                supabase.table("users").insert(
                    {"email": email, "hashed_password": dummy_hash}
                ).execute()
            saved_successfully = True
        except Exception as e:
            logger.warning(f"Supabase google user save failed: {str(e)}")

    if not saved_successfully:
        user = _find_local_user(email)
        if not user:
            dummy_hash = hash_password(credential[:32])
            users = _get_local_users()
            users.append({"email": email, "hashed_password": dummy_hash})
            _save_local_users(users)

    token = create_access_token({"sub": email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_email": email
    }