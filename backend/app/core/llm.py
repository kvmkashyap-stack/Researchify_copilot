from langchain_groq import ChatGroq

from app.core.config import settings


# Do not crash at import time; fallback to dummy so the application boots
groq_api_key = settings.GROQ_API_KEY or "dummy_key"

llm = ChatGroq(
    model=settings.GROQ_MODEL,
    api_key=groq_api_key,
    temperature=0,
    max_tokens=2048
)