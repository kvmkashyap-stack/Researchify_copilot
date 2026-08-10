from pydantic import BaseModel, EmailStr
from typing import Optional


# ==========================
# Register Request
# ==========================

class UserRegister(BaseModel):
    email: EmailStr
    password: str


# ==========================
# Login Request
# ==========================

class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ==========================
# Token Response
# ==========================

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_email: str


# ==========================
# Verify OTP Request
# ==========================

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str

