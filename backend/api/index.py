import os
import sys
import traceback
from pathlib import Path
from fastapi import FastAPI

# Add the parent directory (backend root) to python path
parent_dir = str(Path(__file__).resolve().parent.parent)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

class ASGIWrapper(FastAPI):
    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            # Strip leading /api prefix if present in the path (e.g. /api/auth/login -> /auth/login)
            if scope["path"].startswith("/api"):
                # Avoid stripping our entrypoint index file path itself
                if not scope["path"].startswith("/api/index"):
                    scope["path"] = scope["path"][4:]
                    if not scope["path"]:
                        scope["path"] = "/"
                    scope["raw_path"] = scope["path"].encode("utf-8")
                    
        try:
            # Lazy import of the main FastAPI app inside ASGI call scope
            from app.main import app as fastapi_app
            await fastapi_app(scope, receive, send)
        except BaseException as e:
            tb_str = traceback.format_exc()
            print("EXECUTION ERROR:", tb_str)
            if scope["type"] == "http":
                await send({
                    "type": "http.response.start",
                    "status": 500,
                    "headers": [(b"content-type", b"text/plain; charset=utf-8")]
                })
                await send({
                    "type": "http.response.body",
                    "body": f"ASGI Execution Exception:\n{tb_str}".encode("utf-8")
                })

# Expose a valid FastAPI instance so Vercel's builder compilation succeeds
app = ASGIWrapper()
