from app.core.supabase import supabase
from fastapi import HTTPException

import json
from pathlib import Path
from datetime import datetime
import os

# Local file fallback path
if "VERCEL" in os.environ:
    _DATA_DIR = Path("/tmp")
else:
    _DATA_DIR = Path(__file__).resolve().parents[1] / "data"
_MSG_FILE = _DATA_DIR / "local_messages.json"
_TITLES_FILE = _DATA_DIR / "session_titles.json"


def _ensure_local_storage():
    _DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not _MSG_FILE.exists():
        _MSG_FILE.write_text("[]")


def _ensure_titles_storage():
    _DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not _TITLES_FILE.exists():
        _TITLES_FILE.write_text("{}")


def _get_local_messages():
    _ensure_local_storage()
    return json.loads(_MSG_FILE.read_text())


def _save_local_messages(msgs):
    _ensure_local_storage()
    _MSG_FILE.write_text(json.dumps(msgs, indent=2))


import logging
logger = logging.getLogger(__name__)

def _get_custom_titles(user_email: str = None) -> dict:
    titles = {}
    if supabase and user_email:
        try:
            resp = supabase.table("session_titles").select("session_id, title").eq("user_email", user_email).execute()
            if resp.data:
                for row in resp.data:
                    titles[f"{user_email}:{row['session_id']}"] = row['title']
        except Exception as e:
            logger.warning(f"Failed to load custom titles from Supabase: {str(e)}")

    _ensure_titles_storage()
    try:
        local_titles = json.loads(_TITLES_FILE.read_text())
        for k, v in local_titles.items():
            if user_email:
                if k.startswith(f"{user_email}:"):
                    titles[k] = v
            else:
                titles[k] = v
    except Exception:
        pass
    return titles


def _save_custom_titles(titles):
    _ensure_titles_storage()
    _TITLES_FILE.write_text(json.dumps(titles, indent=2))


def rename_session(user_email: str, session_id: str, new_title: str):
    if supabase:
        try:
            supabase.table("session_titles").upsert({
                "user_email": user_email,
                "session_id": session_id,
                "title": new_title
            }).execute()
        except Exception as e:
            logger.warning(f"Failed to save custom title to Supabase: {str(e)}")

    # Also save locally as fallback
    try:
        _ensure_titles_storage()
        local_titles = json.loads(_TITLES_FILE.read_text())
        key = f"{user_email}:{session_id}"
        local_titles[key] = new_title
        _save_custom_titles(local_titles)
    except Exception:
        pass



# ==================================
# Save Message
# ==================================


def save_message(user_email: str, role: str, message: str, session_id: str = "default"):
    created_at = datetime.utcnow().isoformat()
    if supabase:
        try:
            response = (
                supabase.table("messages").insert({
                    "user_email": user_email,
                    "role": role,
                    "message": message,
                    "session_id": session_id,
                }).execute()
            )
            return response.data
        except Exception as e:
            if "VERCEL" in os.environ:
                raise HTTPException(status_code=500, detail=f"Database save failed: {str(e)}")
            pass

    msgs = _get_local_messages()
    msgs.append({
        "user_email": user_email, 
        "role": role, 
        "message": message, 
        "session_id": session_id,
        "created_at": created_at
    })
    _save_local_messages(msgs)
    return msgs



# ==================================
# Get Chat History
# ==================================


def get_history(user_email: str, session_id: str = "default"):
    if supabase:
        try:
            response = (
                supabase.table("messages")
                .select("*")
                .eq("user_email", user_email)
                .eq("session_id", session_id)
                .order("created_at")
                .execute()
            )
            return response.data
        except Exception as e:
            if "VERCEL" in os.environ:
                raise HTTPException(status_code=500, detail=f"Database fetch failed: {str(e)}")
            pass

    msgs = _get_local_messages()
    return [m for m in msgs if m.get("user_email") == user_email and m.get("session_id", "default") == session_id]


def clear_history(user_email: str):
    if supabase:
        try:
            supabase.table("messages").delete().eq("user_email", user_email).execute()
            return
        except Exception:
            pass

    msgs = _get_local_messages()
    filtered = [m for m in msgs if m.get("user_email") != user_email]
    _save_local_messages(filtered)


# ==================================
# Get Unique Sessions (Threads)
# ==================================

def get_sessions(user_email: str):
    # Retrieve all unique sessions for this user
    if supabase:
        try:
            # Supabase query or fallback
            response = (
                supabase.table("messages")
                .select("session_id, message, role, created_at")
                .eq("user_email", user_email)
                .order("created_at")
                .execute()
            )
            data = response.data
            return _format_sessions_from_rows(data, user_email)
        except Exception as e:
            if "VERCEL" in os.environ:
                raise HTTPException(status_code=500, detail=f"Database fetch sessions failed: {str(e)}")
            pass

    msgs = _get_local_messages()
    user_msgs = [m for m in msgs if m.get("user_email") == user_email]
    return _format_sessions_from_rows(user_msgs, user_email)


def _format_sessions_from_rows(rows, user_email: str):
    # Groups rows by session_id and extracts the first message as title
    custom_titles = _get_custom_titles(user_email)
    sessions_dict = {}
    
    for r in rows:
        sid = r.get("session_id", "default")
        created = r.get("created_at")
        
        # Check if there is an overridden title
        title_key = f"{user_email}:{sid}"
        if title_key in custom_titles:
            title = custom_titles[title_key]
        else:
            title = r.get("message", "New Chat")[:40]
            if len(r.get("message", "")) > 40:
                title += "..."
        
        if sid not in sessions_dict:
            sessions_dict[sid] = {
                "session_id": sid,
                "title": title,
                "created_at": created
            }
        else:
            # If we find a user message and the current title is default and not custom-defined, update it
            title_key = f"{user_email}:{sid}"
            if title_key not in custom_titles and r.get("role") == "user" and sessions_dict[sid]["title"] == "New Chat":
                title = r.get("message", "New Chat")[:40]
                if len(r.get("message", "")) > 40:
                    title += "..."
                sessions_dict[sid]["title"] = title
    
    # Sort sessions by created_at desc (newest first)
    sorted_sessions = sorted(
        sessions_dict.values(),
        key=lambda x: x.get("created_at") or "",
        reverse=True
    )
    return sorted_sessions


def delete_session(user_email: str, session_id: str):
    # Delete custom title from Supabase
    if supabase:
        try:
            supabase.table("session_titles").delete().eq("user_email", user_email).eq("session_id", session_id).execute()
        except Exception:
            pass

    # Delete custom title from local titles
    try:
        local_titles = json.loads(_TITLES_FILE.read_text())
        key = f"{user_email}:{session_id}"
        if key in local_titles:
            del local_titles[key]
            _save_custom_titles(local_titles)
    except Exception:
        pass

    if supabase:
        try:
            supabase.table("messages").delete().eq("user_email", user_email).eq("session_id", session_id).execute()
            return
        except Exception:
            pass

    msgs = _get_local_messages()
    filtered = [m for m in msgs if not (m.get("user_email") == user_email and m.get("session_id", "default") == session_id)]
    _save_local_messages(filtered)


def truncate_history(user_email: str, session_id: str, keep_count: int):
    # Truncate messages in Supabase if active
    if supabase:
        try:
            # We fetch all, sort by created_at, and delete IDs after keep_count
            response = (
                supabase.table("messages")
                .select("id")
                .eq("user_email", user_email)
                .eq("session_id", session_id)
                .order("created_at")
                .execute()
            )
            if response.data and len(response.data) > keep_count:
                ids_to_delete = [r["id"] for r in response.data[keep_count:]]
                supabase.table("messages").delete().in_("id", ids_to_delete).execute()
        except Exception:
            pass

    msgs = _get_local_messages()
    other_msgs = [m for m in msgs if not (m.get("user_email") == user_email and m.get("session_id", "default") == session_id)]
    session_msgs = [m for m in msgs if m.get("user_email") == user_email and m.get("session_id", "default") == session_id]
    
    # Sort by created_at or insertion order (already sorted)
    truncated_session = session_msgs[:keep_count]
    _save_local_messages(other_msgs + truncated_session)