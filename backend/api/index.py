import os
import sys
import traceback
from pathlib import Path
import json

# Add the parent directory (backend root) to python path
parent_dir = str(Path(__file__).resolve().parent.parent)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

try:
    from app.main import app as fastapi_app
    
    # Expose custom ASGI wrapper
    async def app(scope, receive, send):
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
    
    from fastapi import FastAPI
    from fastapi.responses import HTMLResponse
    
    app = FastAPI()
    
    @app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"])
    def catch_all():
        html_content = f"Error: {tb_str}"
        return HTMLResponse(content=html_content, status_code=500)
