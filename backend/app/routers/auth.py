from fastapi import APIRouter

from app.schemas.auth import (
    UserRegister,
    UserLogin,
    TokenResponse,
    VerifyOTPRequest
)

from app.services.auth_service import (
    register_user,
    login_user,
    send_register_otp,
    verify_register_otp
)

router = APIRouter()


# ==================================
# Register with OTP
# ==================================

@router.post("/register-otp")
def register_otp(
    user: UserRegister
):
    return send_register_otp(
        email=user.email,
        password=user.password
    )


@router.post("/verify-otp", response_model=TokenResponse)
def verify_otp(
    request: VerifyOTPRequest
):
    return verify_register_otp(
        email=request.email,
        otp=request.otp
    )


# ==================================
# Register (Legacy / Direct)
# ==================================

@router.post("/register")
def register(
    user: UserRegister
):
    return register_user(
        email=user.email,
        password=user.password
    )


# ==================================
# Login
# ==================================

@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    user: UserLogin
):
    return login_user(
        email=user.email,
        password=user.password
    )