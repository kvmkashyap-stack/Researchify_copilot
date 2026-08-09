import logging
import re
from typing import Any, Dict, List

from app.services.memory_service import (
    save_message,
    get_history
)
from app.agents.graph import (
    run_agent
)
from app.schemas.report import ReportRequest
from app.services.report_service import generate_report_service

logger = logging.getLogger(__name__)

# Max history messages to pass to the model to avoid token limit errors
MAX_HISTORY_MESSAGES = 6

REPORT_TRIGGER_KEYWORDS = [
    r"\bgenerate\s+(a\s+)?(report|paper|documentation)\b",
    r"\bwrite\s+(a\s+)?(research\s+paper|report|ieee\s+paper)\b",
    r"\bdraft\s+(a\s+)?(report|paper)\b",
    r"\bcreate\s+(a\s+)?(report|paper)\b",
    r"\bmake\s+(a\s+)?(report|paper)\b"
]


def is_report_request(prompt: str) -> bool:
    """Checks if the user prompt is asking to generate a structured report or paper."""
    prompt_lower = prompt.lower()
    return any(re.search(pattern, prompt_lower) for pattern in REPORT_TRIGGER_KEYWORDS)


def _format_report_to_markdown(report) -> str:
    """Helper to convert structured ReportResponse into clean readable markdown for chat."""
    formatted = f"# {report.title}\n\n"
    if report.authors:
        formatted += f"**Authors:** {', '.join(report.authors)}\n\n"
    formatted += f"### Abstract\n{report.abstract}\n\n---\n\n"
    
    for sec in report.sections:
        formatted += f"## {sec.title}\n{sec.content}\n\n"
        
    if report.references:
        formatted += "## References\n" + "\n".join([f"- {r}" for r in report.references])
        
    return formatted


def _trim_history(history: List[Any], max_messages: int = MAX_HISTORY_MESSAGES) -> List[Any]:
    """
    Safely trims chat history to the most recent messages to prevent hitting 
    Groq token limits (TPM/RPM) when processing large prompts or uploaded papers.
    """
    if not history or not isinstance(history, list):
        return []
    
    if len(history) > max_messages:
        return history[-max_messages:]
    
    return history


# ==================================
# Chat With AI
# ==================================

async def chat_with_ai(
    user_email: str,
    message: str,
    session_id: str = "default"
) -> Dict[str, str]:
    """
    Handles user chat interaction:
    1. Fetches and trims past session history.
    2. Persists current user message.
    3. Invokes the AI Agent with history context.
    4. Handles Groq/RAG execution errors cleanly without crashing.
    5. Saves AI response and returns payload.
    """
    # 1. Get previous memory (before saving current message)
    raw_history = get_history(
        user_email,
        session_id=session_id
    )

    # 2. Trim history to prevent Groq context window overflow
    history = _trim_history(raw_history, max_messages=MAX_HISTORY_MESSAGES)

    # 3. Save current user message
    try:
        save_message(
            user_email,
            "user",
            message,
            session_id=session_id
        )
    except Exception as e:
        logger.warning(f"Failed to save user message to memory: {str(e)}")

    # 4. Check for report generation intent before standard chat agent
    if is_report_request(message):
        try:
            logger.info(f"Report generation intent detected for prompt: {message}")
            report_req = ReportRequest(
                topic=message,
                format_type="ieee",
                user_email=user_email,
                session_id=session_id,
                use_rag=True,
                use_search=False
            )
            # Await async report service directly (no asyncio.run needed)
            report_res = await generate_report_service(report_req)
            response = _format_report_to_markdown(report_res)

            # 5. Save AI report response
            try:
                save_message(
                    user_email,
                    "assistant",
                    response,
                    session_id=session_id
                )
            except Exception as e:
                logger.warning(f"Failed to save assistant report response to memory: {str(e)}")

            return {
                "response": response
            }
        except Exception as e:
            logger.error(f"[Report Agent Error] Failed to generate report for {user_email}: {str(e)}", exc_info=True)
            # Fallback smoothly to normal agent execution below if report generation fails

    # 4. Run AI Agent with explicit error logging & safety handling
    try:
        response = run_agent(
            message,
            history
        )
    except Exception as e:
        # Log the actual stack trace to server logs so you can inspect it in terminal
        logger.error(f"[Groq/Agent Error] Failed to process message for {user_email}: {str(e)}", exc_info=True)
        
        error_msg = str(e).lower()
        if "rate_limit" in error_msg or "429" in error_msg or "tokens" in error_msg:
            response = (
                "The input document or conversation history is too large for the current processing tier. "
                "Please try asking a more specific question about the document or start a new session."
            )
        else:
            response = (
                "I encountered an error connecting to the AI brain. "
                "Please check your GROQ_API_KEY settings or try again."
            )

    # 5. Save AI response
    try:
        save_message(
            user_email,
            "assistant",
            response,
            session_id=session_id
        )
    except Exception as e:
        logger.warning(f"Failed to save assistant response to memory: {str(e)}")

    return {
        "response": response
    }