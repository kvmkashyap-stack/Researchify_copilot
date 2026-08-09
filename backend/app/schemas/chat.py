from pydantic import BaseModel
from typing import Optional


# ==========================
# Chat Request
# ==========================

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default"


# ==========================
# Chat Response
# ==========================

class ChatResponse(BaseModel):
    response: str


class SessionRenameRequest(BaseModel):
    title: str