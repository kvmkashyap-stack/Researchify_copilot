from pydantic import BaseModel, Field
from typing import List, Optional

class Section(BaseModel):
    title: str = Field(..., description="Title of the section (e.g., Introduction, Research Methodology)")
    content: str = Field(..., description="Detailed markdown content for this section")
    subsections: Optional[List['Section']] = Field(default=None, description="Optional nested subsections")

class ReportRequest(BaseModel):
    topic: str = Field(..., description="Topic or prompt for the research report")
    format_type: str = Field(default="ieee", description="Format template: 'ieee', 'mini_project', or 'survey'")
    user_email: Optional[str] = Field(default="user@example.com")
    session_id: Optional[str] = Field(default="default_session")
    use_rag: bool = Field(default=True, description="Whether to pull background document context")
    use_search: bool = Field(default=False, description="Whether to perform web search context gathering")

class ReportResponse(BaseModel):
    title: str
    authors: List[str]
    abstract: str
    sections: List[Section]
    references: List[str]
    session_id: str