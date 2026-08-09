import httpx

url = "https://researchify-copilot-backend.vercel.app/api/debug-echo"
print("Querying backend /api/debug-echo...")
try:
    resp = httpx.get(url, timeout=15)
    print("Status Code:", resp.status_code)
    print("Body:", resp.json())
except Exception as e:
    print("Error:", e)
