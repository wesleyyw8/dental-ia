from fastapi import FastAPI, Request
from fastapi.responses import PlainTextResponse
from app.routers.consultas import router as consultas_router
from app.routers.dentistas import router as dentistas_router
from app.routers.disponibilidades import router as disponibilidades_router
from app.routers.horarios import router as horarios_router
from app.routers.pacientes import router as pacientes_router
from app.routers.procedimentos import router as procedimentos_router
import os
from app.whatsapp import enviar_mensagem
from app.services.procedimento_service import buscar_procedimentos

app = FastAPI(title="Dental AI API", version="0.1.0")

app.include_router(dentistas_router)
app.include_router(disponibilidades_router)
app.include_router(horarios_router)
app.include_router(consultas_router)
app.include_router(pacientes_router)
app.include_router(procedimentos_router)

@app.get("/webhook/whatsapp")
async def verificar_webhook(request: Request):
    params = request.query_params

    mode = params.get("hub.mode")
    token = params.get("hub.verify_token")
    challenge = params.get("hub.challenge")

    if mode == "subscribe" and token == os.getenv("WHATSAPP_VERIFY_TOKEN"):
        return PlainTextResponse(challenge)

    return PlainTextResponse("Forbidden", status_code=403)

@app.post("/webhook/whatsapp")
async def receber_mensagem(request: Request):
    data = await request.json()
    value = data["entry"][0]["changes"][0]["value"]

    if "messages" not in value:
        return {"status": "ok"}
    
    mensagem = value["messages"][0]

    numero = mensagem["from"]
    texto = mensagem["text"]["body"]

    if texto == "1":
      procedimentos = buscar_procedimentos()

      resposta = "Beleza! Qual procedimento você deseja?\n\n"

      for i, procedimento in enumerate(procedimentos, start=1):
          resposta += f"{i} - {procedimento['nome']}\n"

      enviar_mensagem(numero, resposta)
      return {"status": "ok"}


    resposta = """Olá! Como posso ajudar?

    1 - Agendar consulta
    2 - Remarcar consulta
    3 - Cancelar consulta"""

    enviar_mensagem(numero, resposta)
    return {"status": "ok"}