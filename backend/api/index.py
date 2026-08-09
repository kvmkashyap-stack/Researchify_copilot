import os
import sys
from pathlib import Path

# Add the parent directory (backend root) to python path
parent_dir = str(Path(__file__).resolve().parent.parent)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

# Import the main FastAPI app and expose it to Vercel
from app.main import app
