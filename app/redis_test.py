import os

from dotenv import load_dotenv
from google import genai

from app.services.ia_service import (
    salvar_historico,
    carregar_historico,
    reconstruir_history,
)

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GOOGLE_API_KEY")
)

# 1. Cria um Chat
chat = client.chats.create(
    model="gemini-3.8-flash"
)

# 2. Cria uma conversa
chat.send_message("Meu nome é Wesley.")

# 3. Pega o histórico do Gemini
history = chat.get_history(curated=True)

print("HISTORY ORIGINAL:")
print(history)

# 4. Salva o histórico no Redis
salvar_historico("teste", history)

# 5. Recupera do Redis
historico = carregar_historico("teste")

print("\nHISTÓRICO DO REDIS:")
print(historico)

# 6. Reconstrói no formato que o Gemini aceita
history_reconstruido = reconstruir_history(historico)

print("\nHISTORY RECONSTRUÍDO:")
print(history_reconstruido)

# 7. Cria OUTRO Chat usando o histórico do Redis
novo_chat = client.chats.create(
    model="gemini-3.8-flash",
    history=history_reconstruido,
)

# 8. Testa se ele lembra da conversa anterior
response = novo_chat.send_message("Qual é o meu nome?")

print("\nRESPOSTA:")
print(response.text)