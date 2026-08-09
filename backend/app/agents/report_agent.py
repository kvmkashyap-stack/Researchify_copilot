import logging
from app.core.config import settings
from langchain_groq import ChatGroq
from app.schemas.report import ReportResponse
from app.prompts.report_prompt import report_generation_prompt

logger = logging.getLogger(__name__)

async def run_report_agent(topic: str, context: str, format_type: str = "ieee", session_id: str = "default_session") -> ReportResponse:
    """Executes structured LLM generation to return a validated ReportResponse object using JSON mode."""
    try:
        # Instantiate a dedicated LLM with response_format json_object enabled
        json_llm = ChatGroq(
            model=settings.GROQ_MODEL,
            api_key=settings.GROQ_API_KEY,
            temperature=0.2,
            max_tokens=4096,
            response_format={"type": "json_object"}
        )
        
        prompt_value = report_generation_prompt.format_prompt(
            topic=topic,
            context=context if context else "No external document context provided.",
            format_type=format_type,
            session_id=session_id
        )
        
        # Invoke LLM asynchronously
        resp = await json_llm.ainvoke(prompt_value.to_messages())
        
        # Parse and validate response text using Pydantic model
        report_data = ReportResponse.model_validate_json(resp.content)
        
        # Ensure session ID matches the request session
        report_data.session_id = session_id
        
        return report_data
    except Exception as e:
        logger.error(f"Error in report_agent pipeline: {str(e)}")
        raise e