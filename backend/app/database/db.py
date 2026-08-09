from supabase import create_client, Client
from app.core.config import settings

# Initialize Supabase client
SUPABASE_URL: str = getattr(settings, "SUPABASE_URL", None) or os.getenv("SUPABASE_URL", "")
SUPABASE_KEY: str = getattr(settings, "SUPABASE_KEY", None) or os.getenv("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY in environment settings.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)