"""
Servicio de envío de correos para recuperación de contraseña.

Credenciales leídas desde variables de entorno (archivo .env en la raíz del backend):
  SMTP_USER     → tu dirección de Gmail (ej: tuapp@gmail.com)
  SMTP_PASSWORD → contraseña de aplicación de Google (16 caracteres sin espacios)
  FRONTEND_URL  → URL base del frontend (ej: http://localhost:4200)

Para generar la contraseña de aplicación de Gmail:
  1. Ve a myaccount.google.com → Seguridad
  2. Activa la Verificación en 2 pasos
  3. Luego busca "Contraseñas de aplicación"
  4. Crea una nueva con el nombre "AuraStock" y copia los 16 caracteres
"""
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from dotenv import load_dotenv

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:4200")


def send_reset_email(to_email: str, token: str) -> None:
    """
    Envía el correo de recuperación de contraseña.
    Lanza una excepción si el envío falla (la manejarás en el router).
    """
    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"

    subject = "Restablecer contraseña — AuraStock"

    html_body = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        body {{ font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f11; margin: 0; padding: 0; }}
        .wrapper {{ max-width: 520px; margin: 40px auto; background: #18181b; border-radius: 16px;
                    border: 1px solid #27272a; overflow: hidden; }}
        .header {{ background: linear-gradient(135deg, #0F9C8E, #2AB6C9);
                   padding: 32px 40px; text-align: center; }}
        .header h1 {{ color: #fff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }}
        .body {{ padding: 36px 40px; }}
        .body p {{ color: #a1a1aa; font-size: 15px; line-height: 1.6; margin: 0 0 20px; }}
        .btn {{ display: inline-block; background: linear-gradient(135deg, #0F9C8E, #2AB6C9);
                color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px;
                font-weight: 600; font-size: 15px; letter-spacing: 0.01em;
                box-shadow: 0 4px 16px rgba(15,156,142,0.35); }}
        .note {{ font-size: 12px !important; color: #71717a !important; margin-top: 28px !important; }}
        .footer {{ padding: 20px 40px; border-top: 1px solid #27272a; text-align: center; }}
        .footer p {{ color: #52525b; font-size: 12px; margin: 0; }}
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>🔐 AuraStock</h1>
        </div>
        <div class="body">
          <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
          <p>Haz clic en el botón para continuar. El enlace es válido por <strong>1 hora</strong>.</p>
          <p style="text-align:center">
            <a href="{reset_link}" class="btn">Restablecer contraseña</a>
          </p>
          <p class="note">
            Si no solicitaste este cambio, podés ignorar este correo. Tu contraseña no será modificada.
          </p>
          <p class="note">
            Si el botón no funciona, copiá y pegá este enlace en tu navegador:<br>
            <span style="color:#34D6C4">{reset_link}</span>
          </p>
        </div>
        <div class="footer">
          <p>© 2025 AuraStock · Inventario inteligente</p>
        </div>
      </div>
    </body>
    </html>
    """

    text_body = (
        f"Restablecé tu contraseña de AuraStock visitando:\n{reset_link}\n\n"
        "Este enlace expira en 1 hora."
    )

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"AuraStock <{SMTP_USER}>"
    msg["To"] = to_email

    msg.attach(MIMEText(text_body, "plain", "utf-8"))
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.ehlo()
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, to_email, msg.as_string())
