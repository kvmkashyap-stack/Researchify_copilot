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
    
    # Expose custom ASGI wrapper to handle Vercel serverless prefix routing
    async def app(scope, receive, send):
        if scope["type"] == "http":
            headers_dict = {k.decode("utf-8"): v.decode("utf-8") for k, v in scope.get("headers", [])}
            query_string = scope.get("query_string", b"").decode("utf-8")
            
            # Diagnostic check: return raw scope data immediately if debug flag is present
            if "x-show-debug" in headers_dict or "x-show-debug" in query_string:
                diag_data = {
                    "scope_path": scope.get("path"),
                    "scope_raw_path": scope.get("raw_path", b"").decode("utf-8", errors="replace"),
                    "headers": headers_dict,
                    "query_string": query_string
                }
                await send({
                    "type": "http.response.start",
                    "status": 200,
                    "headers": [(b"content-type", b"application/json")]
                })
                await send({
                    "type": "http.response.body",
                    "body": json.dumps(diag_data).encode("utf-8")
                })
                return

            # Strip leading /api prefix if present in the path (e.g. /api/auth/login -> /auth/login)
            if scope["path"].startswith("/api"):
                if not scope["path"].startswith("/api/index"):
                    scope["path"] = scope["path"][4:]
                    if not scope["path"]:
                        scope["path"] = "/"
                    scope["raw_path"] = scope["path"].encode("utf-8")
                
        await fastapi_app(scope, receive, send)

except BaseException as e:
    tb_str = traceback.format_exc()
    print("STARTUP ERROR:", tb_str)
    
    from fastapi import FastAPI
    from fastapi.responses import HTMLResponse
    
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
