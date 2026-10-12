import os
import requests
from dotenv import load_dotenv

load_dotenv()


def enviar_mensagem(to: str, mensagem: str):
    print("🔥 ENVIAR_MENSAGEM FOI CHAMADO")
    print("🔥 TO:", to)
    print("🔥 TEXTO:", mensagem)
    phone_number_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
    token = os.getenv("WHATSAPP_TOKEN")

    url = f"https://graph.facebook.com/v25.0/{phone_number_id}/messages"

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {
            "body": mensagem
        }
    }

    print("PHONE NUMBER ID:", phone_number_id)

    response = requests.post(
        url,
        headers=headers,
        json=payload
    )

    return response

