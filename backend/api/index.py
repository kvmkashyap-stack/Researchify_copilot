import os
import sys
import traceback
from pathlib import Path

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
            if "debug=1" in query_string:
                # Return diagnostic info if debug=1 is requested
                headers = {k.decode("utf-8"): v.decode("utf-8") for k, v in scope.get("headers", [])}
                response_body = f"""
                <html>
                <body style="font-family: monospace; background-color: #0f172a; color: #f1f5f9; padding: 20px;">
                    <h1 style="color: #38bdf8;">Vercel ASGI Diagnostic Scope</h1>
                    <h2>ASGI Path: <span style="color: #22c55e;">{scope.get("path")}</span></h2>
                    <h2>Raw Query: <span style="color: #22c55e;">{query_string}</span></h2>
                    <hr style="border-color: #334155;"/>
                    <h3>Headers Received:</h3>
                    <pre style="background-color: #1e293b; padding: 15px; border-radius: 6px; border: 1px solid #334155;">
{headers}
                    </pre>
                </body>
                </html>
                """.encode("utf-8")
                
                await send({
                    "type": "http.response.start",
                    "status": 200,
                    "headers": [(b"content-type", b"text/html; charset=utf-8")]
                })
                await send({
                    "type": "http.response.body",
                    "body": response_body
                })
                return

            # Intercept and fix path if x-matched-path is sent by Vercel
            headers = dict(scope.get("headers", []))
            matched_path = headers.get(b"x-matched-path")
            if matched_path:
                scope["path"] = matched_path.decode("utf-8")
                
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
