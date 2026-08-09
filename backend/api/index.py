import os
import sys
import traceback
from pathlib import Path
import json

# Add the parent directory (backend root) to python path
parent_dir = str(Path(__file__).resolve().parent.parent)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

# Expose custom ASGI wrapper to handle Vercel serverless prefix routing
async def app(scope, receive, send):
    try:
        # Import inside local scope to hide FastAPI instance from Vercel's global scanner
        from app.main import app as fastapi_app
        
        if scope["type"] == "http":
            # STATIC OVERRIDE: Prove if wrapper is executing on Vercel
            response_data = {"message": "Hello from ASGI wrapper!"}
            await send({
                "type": "http.response.start",
                "status": 200,
                "headers": [(b"content-type", b"application/json")]
            })
            await send({
                "type": "http.response.body",
                "body": json.dumps(response_data).encode("utf-8")
            })
            return
            
        await fastapi_app(scope, receive, send)
        
    except BaseException as e:
        tb_str = traceback.format_exc()
        print("STARTUP ERROR:", tb_str)
        if scope["type"] == "http":
            await send({
                "type": "http.response.start",
                "status": 500,
                "headers": [(b"content-type", b"text/plain; charset=utf-8")]
            })
            await send({
                "type": "http.response.body",
                "body": f"Startup Exception:\n{tb_str}".encode("utf-8")
            })
