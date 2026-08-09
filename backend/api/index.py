import os
import sys
import traceback
from pathlib import Path

# Add the parent directory (backend root) to python path
parent_dir = str(Path(__file__).resolve().parent.parent)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

try:
    from app.main import app
except BaseException as e:
    tb_str = traceback.format_exc()
    print("STARTUP ERROR:", tb_str)
    
    try:
        from fastapi import FastAPI
        from fastapi.responses import HTMLResponse
        
        # Expose a fallback FastAPI instance if the main app import fails
        app = FastAPI()
        
        @app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"])
        def catch_all():
            html_content = f"""
            <html>
            <body style="font-family: monospace; background-color: #0f172a; color: #f1f5f9; padding: 20px; font-size: 16px;">
                <h1 style="color: #ef4444;">App Startup Exception Traceback</h1>
                <pre style="background-color: #1e293b; padding: 20px; border-radius: 8px; border: 1px solid #334155; overflow-x: auto;">
{tb_str}
                </pre>
            </body>
            </html>
            """
            return HTMLResponse(content=html_content, status_code=500)
    except BaseException as inner_e:
        # Final fallback raw ASGI if even fastapi is missing
        async def app(scope, receive, send):
            if scope["type"] == "http":
                response_body = f"FastAPI missing. Traceback:\n{tb_str}".encode("utf-8")
                await send({
                    "type": "http.response.start",
                    "status": 500,
                    "headers": [(b"content-type", b"text/plain")],
                })
                await send({
                    "type": "http.response.body",
                    "body": response_body,
                })
