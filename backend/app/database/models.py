from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

# ==========================
# Document Models
# ==========================

class DocumentBase(BaseModel):
    title: str
    content: Optional[str] = None
    metadata_info: Optional[Dict[str, Any]] = Field(default=None, alias="metadata")

class DocumentCreate(DocumentBase):
    pass

class DocumentResponse(DocumentBase):
    id: str  # Supabase UUIDs are strings
    user_id: str
    created_at: Optional[datetime] = None

    class Config:
        populate_by_name = True


# ==========================
# Chat / Message Models
# ==========================

class MessageBase(BaseModel):
    session_id: str
    role: str  # 'user' or 'assistant'
    content: str

class MessageCreate(MessageBase):
    pass

class MessageResponse(MessageBase):
    id: str
    created_at: Optional[datetime] = None

    class Config:
        populate_by_name = True