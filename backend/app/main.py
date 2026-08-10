from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.documents import (
    router as document_router
)

from app.core.config import settings

from app.routers.auth import (
    router as auth_router
)

from app.routers.chat import (
    router as chat_router
)

from app.routers.report import (
    router as report_router
)

from app.schemas.auth import UserRegister, UserLogin, TokenResponse, VerifyOTPRequest
from app.services.auth_service import register_user, login_user, send_register_otp, verify_register_otp
from fastapi import Request


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0"
)

class ASGIPrefixMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            if scope["path"].startswith("/api"):
                # Do not strip the serverless entrypoint script name itself
                if not scope["path"].startswith("/api/index"):
                    scope["path"] = scope["path"][4:]
                    if not scope["path"]:
                        scope["path"] = "/"
                    scope["raw_path"] = scope["path"].encode("utf-8")
        await self.app(scope, receive, send)

app.add_middleware(ASGIPrefixMiddleware)

# CORS - allow frontend dev server
# Determine allowed origins from settings (comma-separated)
raw_origins = getattr(settings, "ALLOWED_ORIGINS", "")
if raw_origins:
    origins = [o.strip() for o in raw_origins.split(",") if o.strip()]
else:
    origins = ["http://localhost:3000", "http://127.0.0.1:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==============================
# Register Routers
# ==============================

app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)


app.include_router(
    chat_router,
    prefix="/chat",
    tags=["AI Chat"]
)


app.include_router(
    report_router,
    prefix="/report",
    tags=["Report Generator"]
)


# ==============================
# Root Endpoint
# ==============================

@app.get("/")
def root():
    return {
        "message": "AI Copilot Backend Running 🚀"
    }


# Convenience root auth endpoints (allow frontend to call /api/register and /api/login)


@app.post("/register-otp")
def register_otp_root(user: UserRegister):
    return send_register_otp(email=user.email, password=user.password)


@app.post("/verify-otp", response_model=TokenResponse)
def verify_otp_root(request: VerifyOTPRequest):
    return verify_register_otp(email=request.email, otp=request.otp)


@app.post("/register")
def register_root(user: UserRegister):
    return register_user(email=user.email, password=user.password)


@app.post("/login", response_model=TokenResponse)
def login_root(user: UserLogin):
    return login_user(email=user.email, password=user.password)


@app.post("/google-login", response_model=TokenResponse)
def google_login_root(request: GoogleLoginRequest):
    return google_login_user(credential=request.credential)


@app.post("/debug-echo")
async def debug_echo(request: Request):
    body = await request.body()
    return {"raw": body.decode("utf-8", errors="replace"), "headers": dict(request.headers)}


app.include_router(
    document_router,
    prefix="/documents",
    tags=["Documents"]
)