import os

from dotenv import load_dotenv


# Load .env file
load_dotenv()


def _safe_int(val: str, default: int) -> int:
    if not val or not str(val).strip():
        return default
    try:
        return int(val)
    except ValueError:
        return default


class Settings:
    # Application
    APP_NAME: str = os.getenv("APP_NAME", "AI_Copilot")

    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev_secret")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = _safe_int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"), 30)

    # Supabase
    SUPABASE_URL: str = os.getenv("SUPABASE_URL")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY")

    # Groq
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    # Server
    BACKEND_HOST: str = os.getenv("BACKEND_HOST", "0.0.0.0")
    BACKEND_PORT: int = _safe_int(os.getenv("BACKEND_PORT"), 8000)

    # Comma-separated list of allowed origins for CORS
    ALLOWED_ORIGINS: str = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000"
    )

    # SMTP Settings for OTP Emails
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = _safe_int(os.getenv("SMTP_PORT"), 587)
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_SENDER: str = os.getenv("SMTP_SENDER", "")

    # Google OAuth
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")


settings = Settings()