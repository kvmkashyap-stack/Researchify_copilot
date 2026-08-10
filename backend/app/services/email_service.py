import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sys
from app.core.config import settings

def send_otp_email(to_email: str, otp: str):
    """
    Sends an OTP email to the user.
    Priority: 1) Resend HTTP API  2) SMTP SSL (465)  3) SMTP STARTTLS (587)
    Falls back to printing to console if nothing is configured.
    """
    smtp_host = settings.SMTP_HOST
    smtp_port = settings.SMTP_PORT
    smtp_user = settings.SMTP_USER
    smtp_password = settings.SMTP_PASSWORD
    smtp_sender = settings.SMTP_SENDER if settings.SMTP_SENDER else smtp_user

    # Always log the OTP to the backend console first
    print("\n" + "="*50)
    print(f"[OTP CODE] FOR {to_email}: {otp}")
    print("="*50 + "\n")
    sys.stdout.flush()

    subject = f"Your Verification Code: {otp}"
    
    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #050505; color: #ffffff; padding: 20px; text-align: center;">
        <div style="max-width: 500px; margin: auto; background-color: #0b0b0b; border: 1px solid #1a1a1a; border-radius: 12px; padding: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
          <h2 style="color: #22d3ee; margin-bottom: 20px;">AI Research Copilot</h2>
          <p style="color: #a3a3a3; font-size: 16px; line-height: 1.5;">Thank you for registering. Use the verification code below to complete your account setup:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ffffff; background-color: #161616; padding: 15px; border-radius: 8px; margin: 30px 0; border: 1px solid #22d3ee50;">
            {otp}
          </div>
          <p style="color: #737373; font-size: 12px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      </body>
    </html>
    """

    # ==========================================
    # Strategy 1: Resend HTTP API (best for serverless - uses HTTPS port 443)
    # ==========================================
    resend_api_key = os.getenv("RESEND_API_KEY")
    if resend_api_key:
        try:
            import httpx
            print(f"[EMAIL] Attempting Resend API to {to_email}...")
            resp = httpx.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {resend_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "from": "onboarding@resend.dev",
                    "to": to_email,
                    "subject": subject,
                    "html": html_content
                },
                timeout=10
            )
            if resp.status_code in [200, 201, 202]:
                print(f"[EMAIL] Resend API success for {to_email}.")
                return
            else:
                print(f"[WARNING] Resend API status {resp.status_code}: {resp.text}")
        except Exception as e:
            print(f"[WARNING] Resend API failed: {str(e)}")

    # ==========================================
    # Strategy 2: SMTP (try configured port, then fallback to other port)
    # ==========================================
    if not (smtp_host and smtp_user and smtp_password):
        print("[WARNING] SMTP not configured & Resend API not available. OTP printed to console only.")
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = smtp_sender
    msg["To"] = to_email
    msg.attach(MIMEText(html_content, "html"))

    # Try configured port first, then try the alternative
    ports_to_try = [smtp_port]
    if smtp_port != 465:
        ports_to_try.append(465)
    if smtp_port != 587:
        ports_to_try.append(587)

    last_error = None
    for port in ports_to_try:
        try:
            print(f"[EMAIL] Attempting SMTP on port {port} to {to_email}...")
            if port == 465:
                server = smtplib.SMTP_SSL(smtp_host, port, timeout=10)
                server.ehlo()
            else:
                server = smtplib.SMTP(smtp_host, port, timeout=10)
                server.ehlo()
                server.starttls()
                server.ehlo()

            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_sender, to_email, msg.as_string())
            server.quit()
            print(f"[EMAIL] SMTP success on port {port} for {to_email}.")
            return
        except Exception as e:
            last_error = e
            print(f"[WARNING] SMTP port {port} failed: {str(e)}")
            continue

    print(f"[ERROR] All email delivery methods failed for {to_email}. Last error: {str(last_error)}")
    print("[INFO] OTP was printed to console above. User can check Vercel logs.")
    raise RuntimeError(f"All email delivery methods failed. Last error: {str(last_error)}")
