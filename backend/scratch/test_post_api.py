import httpx

url = "https://researchify-copilot-backend.vercel.app/api/auth/register-otp"
print("Querying backend /api/auth/register-otp...")
try:
    resp = httpx.post(url, json={"email": "test@example.com", "password": "password123"}, timeout=15)
    print("Status Code:", resp.status_code)
    print("Headers:", resp.headers)
    print("Body:", resp.text)
except Exception as e:
    print("Error:", e)
