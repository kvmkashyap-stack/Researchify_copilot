import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sys
from app.core.config import settings

def send_otp_email(to_email: str, otp: str):
    """
    Sends an OTP email to the user.
    Falls back to printing to console if SMTP settings are not configured.
    """
    smtp_host = settings.SMTP_HOST
    smtp_port = settings.SMTP_PORT
    smtp_user = settings.SMTP_USER
    smtp_password = settings.SMTP_PASSWORD
    smtp_sender = settings.SMTP_SENDER if settings.SMTP_SENDER else smtp_user

    # Always log the OTP to the backend uvicorn console first
    print("\n" + "="*50)
    print(f"[OTP CODE] FOR {to_email}: {otp}")
    print("="*50 + "\n")
    sys.stdout.flush()

    if not (smtp_host and smtp_user and smtp_password):
        print("[WARNING] SMTP is not fully configured in backend environment variables (SMTP_HOST, SMTP_USER, SMTP_PASSWORD).")
        print("Fallback mode active: OTP code printed to terminal console.")
        return

    try:
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

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = smtp_sender
        msg["To"] = to_email

        msg.attach(MIMEText(html_content, "html"))

        if smtp_port == 465:
            server = smtplib.SMTP_SSL(smtp_host, smtp_port)
        else:
            server = smtplib.SMTP(smtp_host, smtp_port)
            server.starttls()

        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_sender, to_email, msg.as_string())
        server.quit()
        print(f"[EMAIL] Successfully sent verification email to {to_email}.")
    except Exception as e:
        print(f"[ERROR] Error sending SMTP email to {to_email}: {str(e)}")
