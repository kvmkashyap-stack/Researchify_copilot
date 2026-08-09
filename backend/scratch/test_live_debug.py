import httpx

url = "https://researchify-copilot-backend.vercel.app/anything?debug=1"
print("Querying /anything?debug=1...")
try:
    resp = httpx.get(url, timeout=15)
    print("Status Code:", resp.status_code)
    print("Body:", resp.text)
except Exception as e:
    print("Error:", e)
