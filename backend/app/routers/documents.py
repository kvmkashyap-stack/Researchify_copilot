import shutil
import os

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends
)

from app.core.security import (
    get_current_user
)

# Import tools lazily to avoid heavy dependencies at app startup
# (they will be imported when the endpoint is called)

# Initialize router here so app/main.py can import it successfully
router = APIRouter()

UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)

# =====================================
# Upload PDF
# =====================================

@router.post("/upload")
def upload_document(
    file: UploadFile = File(...),
    current_user = Depends(
        get_current_user
    )
):
    file_path = (
        f"{UPLOAD_DIR}/{file.filename}"
    )

    # Save uploaded file
    with open(
        file_path,
        "wb"
    ) as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    # Create FAISS index
    from app.tools.rag import ingest_pdf

    result = ingest_pdf(file_path)

    return result