from fastapi import (
    APIRouter,
    Depends,
    Query
)
from typing import Optional

from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
    SessionRenameRequest
)

from app.services.chat_service import (
    chat_with_ai
)

from app.core.security import (
    get_current_user
)

router = APIRouter()


# ==================================
# Chat Endpoint
# ==================================

@router.post(
    "",
    response_model=ChatResponse
)
async def chat(
    request: ChatRequest,
    current_user = Depends(
        get_current_user
    )
):
    return await chat_with_ai(
        user_email=current_user["email"],
        message=request.message,
        session_id=request.session_id or "default"
    )


@router.get("/history")
def get_chat_history(
    session_id: Optional[str] = Query("default"),
    current_user = Depends(get_current_user)
):
    from app.services.memory_service import get_history
    history_data = get_history(current_user["email"], session_id=session_id)
    return [{"role": h.get("role"), "content": h.get("message")} for h in history_data]


@router.delete("/history")
def delete_all_chat_history(
    current_user = Depends(get_current_user)
):
    from app.services.memory_service import clear_history
    clear_history(current_user["email"])
    return {"message": "All chat history cleared successfully"}


# ==================================
# Sessions Management
# ==================================

@router.get("/sessions")
def get_chat_sessions(
    current_user = Depends(get_current_user)
):
    from app.services.memory_service import get_sessions
    return get_sessions(current_user["email"])


@router.delete("/sessions/{session_id}")
def delete_specific_session(
    session_id: str,
    current_user = Depends(get_current_user)
):
    from app.services.memory_service import delete_session
    delete_session(current_user["email"], session_id)
    return {"message": f"Session {session_id} deleted successfully"}


@router.put("/sessions/{session_id}/rename")
def rename_specific_session(
    session_id: str,
    request: SessionRenameRequest,
    current_user = Depends(get_current_user)
):
    from app.services.memory_service import rename_session
    rename_session(current_user["email"], session_id, request.title)
    return {"message": f"Session {session_id} renamed to '{request.title}' successfully"}


@router.post("/sessions/{session_id}/truncate")
def truncate_specific_session(
    session_id: str,
    keep_count: int = Query(..., description="Number of messages to keep from the beginning of the history"),
    current_user = Depends(get_current_user)
):
    from app.services.memory_service import truncate_history
    truncate_history(current_user["email"], session_id, keep_count)
    return {"message": f"Session {session_id} truncated to {keep_count} messages successfully"}