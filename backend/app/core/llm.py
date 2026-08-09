from langchain_groq import ChatGroq

from app.core.config import settings


if not settings.GROQ_API_KEY:
    raise ValueError(
        "GROQ_API_KEY missing"
    )


llm = ChatGroq(
    model=settings.GROQ_MODEL,
    api_key=settings.GROQ_API_KEY,
    temperature=0,
    max_tokens=2048
)