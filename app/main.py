import os

from fastapi import FastAPI, Request
from fastapi.responses import PlainTextResponse

from app.routers.consultas import router as consultas_router
from app.routers.dentistas import router as dentistas_router
from app.routers.disponibilidades import router as disponibilidades_router
from app.routers.horarios import router as horarios_router
from app.routers.pacientes import router as pacientes_router
from app.routers.procedimentos import router as procedimentos_router
from app.services.whatsapp_ura_service import processar_mensagem
from app.services.ia_service import conversar
from app.whatsapp import enviar_mensagem

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

    try:
        value = data["entry"][0]["changes"][0]["value"]
    except (KeyError, IndexError, TypeError):
        return {"status": "ok"}

    if "messages" not in value:
        return {"status": "ok"}

    mensagem = value["messages"][0]

    if mensagem.get("type") != "text":
        return {"status": "ok"}

    numero = mensagem.get("from")
    texto = mensagem.get("text", {}).get("body")

    if not numero or not texto:
        return {"status": "ok"}

    resposta = conversar(numero, texto)
    enviar_mensagem(numero, resposta)
    return {"status": "ok"}
