from google import genai
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))


class Agendamento(BaseModel):
    data: str
    horario: str
    procedimento: str


response = client.models.generate_content(
    model="gemini-3.8-flash",
    contents="Quero fazer clareamento terça-feira às 14h.",
    config={
        "response_mime_type": "application/json",
        "response_schema": Agendamento,
    },
)

print(response.text)