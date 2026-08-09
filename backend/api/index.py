import os
import sys
import traceback
from pathlib import Path
from urllib.parse import parse_qs

# Add the parent directory (backend root) to python path
parent_dir = str(Path(__file__).resolve().parent.parent)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

try:
    from app.main import app as fastapi_app
    
    # Expose custom ASGI wrapper to capture debug info and inspect Vercel path routing
    async def app(scope, receive, send):
        if scope["type"] == "http":
            query_string = scope.get("query_string", b"").decode("utf-8")
            params = parse_qs(query_string)
            
            # 1. Check if Vercel query parameter path overrides are injected
            if "path" in params and len(params["path"]) > 0:
                original_path = params["path"][0]
                scope["path"] = original_path
                scope["raw_path"] = original_path.encode("utf-8")
            else:
                # Fallback: Intercept and fix path if x-matched-path is sent by Vercel
                headers = dict(scope.get("headers", []))
                matched_path = headers.get(b"x-matched-path")
                if matched_path:
                    path_str = matched_path.decode("utf-8")
                    scope["path"] = path_str
                    scope["raw_path"] = path_str.encode("utf-8")
                
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
