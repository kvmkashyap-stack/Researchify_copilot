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
import os
if "VERCEL" in os.environ:
    _DATA_DIR = Path("/tmp")
else:
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


_PENDING_FILE = _DATA_DIR / "pending_regs.json"


def _ensure_pending_storage():
    _ensure_local_storage()
    if not _PENDING_FILE.exists():
        _PENDING_FILE.write_text("{}")


def _get_pending_registrations() -> dict:
    _ensure_pending_storage()
    try:
        return json.loads(_PENDING_FILE.read_text())
    except Exception:
        return {}


def _save_pending_registrations(data: dict):
    _ensure_pending_storage()
    _PENDING_FILE.write_text(json.dumps(data, indent=2))


def generate_otp() -> str:
    return f"{random.randint(100000, 999999)}"


def send_register_otp(email: str, password: str):
    """
    Checks if a user exists. If not, generates an OTP, stores the registration state
    and sends the OTP via email (or prints it for dev/fallback).
    """
    email = email.strip().lower()

    # Check if user already exists
    user_exists = False
    if supabase:
        try:
            existing = (
                supabase.table("users").select("*").eq("email", email).execute()
            )
            if existing.data and len(existing.data) > 0:
                user_exists = True
        except Exception as e:
            logger.warning(f"Supabase connection check failed, using local fallback: {str(e)}")

    if not user_exists:
        local_user = _find_local_user(email)
        if local_user:
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

    pending_regs = _get_pending_registrations()
    pending_regs[email] = {
        "hashed_password": hashed_password,
        "otp": otp,
        "expires_at": expires_at,
    }
    _save_pending_registrations(pending_regs)

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

    pending_regs = _get_pending_registrations()
    if email not in pending_regs:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No pending registration found for this email. Please request a new OTP.",
        )

    pending = pending_regs[email]

    if time.time() > pending["expires_at"]:
        if email in pending_regs:
            del pending_regs[email]
            _save_pending_registrations(pending_regs)
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
            logger.warning(f"Supabase user insert failed: {str(e)}")
            if "VERCEL" in os.environ:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Database user registration failed (verify Row-Level Security / RLS policies): {str(e)}",
                )

    if not saved_successfully:
        users = _get_local_users()
        users.append({"email": email, "hashed_password": hashed_password})
        _save_local_users(users)

    # Clean up pending session
    pending_regs = _get_pending_registrations()
    if email in pending_regs:
        del pending_regs[email]
        _save_pending_registrations(pending_regs)

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
            if "VERCEL" in os.environ:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Database login query failed: {str(e)}",
                )

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

