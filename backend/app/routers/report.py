from fastapi import APIRouter, HTTPException, status
from app.schemas.report import ReportRequest, ReportResponse
from app.services.report_service import generate_report_service

router = APIRouter(tags=["report"])

@router.post("/generate", response_model=ReportResponse, status_code=status.HTTP_200_OK)
async def generate_report_endpoint(request: ReportRequest):
    """POST endpoint to generate structured papers/reports."""
    try:
        report = await generate_report_service(request)
        return report
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate structured report: {str(e)}"
        )