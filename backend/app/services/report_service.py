import logging
from app.schemas.report import ReportRequest, ReportResponse
from app.agents.report_agent import run_report_agent
from app.services.memory_service import save_message
from app.tools.rag import search_documents
from app.tools.duckduckgo_search import web_search

logger = logging.getLogger(__name__)

async def generate_report_service(request: ReportRequest) -> ReportResponse:
    """Coordinates retrieval tools, agent invocation, and session logging."""
    context_data = []

    # 1. Fetch RAG vector context if enabled
    if request.use_rag:
        try:
            rag_docs = search_documents(request.topic)
            if rag_docs:
                rag_text = "\n".join([doc.page_content for doc in rag_docs])
                context_data.append(f"Document RAG Context:\n{rag_text}")
        except Exception as e:
            logger.warning(f"RAG lookup bypassed/failed: {str(e)}")

    # 2. Fetch DuckDuckGo Search context if requested
    if request.use_search:
        try:
            search_result = web_search(request.topic)
            if search_result:
                context_data.append(f"Web Search Context:\n{search_result}")
        except Exception as e:
            logger.warning(f"Web search lookup bypassed/failed: {str(e)}")

    full_context = "\n\n".join(context_data)

    # 3. Generate structured output via LLM agent
    report = await run_report_agent(
        topic=request.topic,
        context=full_context,
        format_type=request.format_type,
        session_id=request.session_id
    )

    # 4. Save generation activity log to database memory
    try:
        save_message(
            user_email=request.user_email,
            role="assistant",
            message=f"Generated Paper: {report.title}",
            session_id=request.session_id
        )
    except Exception as e:
        logger.warning(f"Failed to record memory event: {str(e)}")

    return report