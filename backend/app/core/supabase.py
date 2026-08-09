from supabase import (
    Client,
    create_client
)

from app.core.config import settings


# If SUPABASE is configured, create a client; otherwise export None for local fallbacks
if settings.SUPABASE_URL and settings.SUPABASE_KEY:
    supabase: Client = create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_KEY
    )
else:
    supabase = None