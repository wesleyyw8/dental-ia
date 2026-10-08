import os

from dotenv import load_dotenv
from google import genai
from app.services.procedimento_service import buscar_procedimentos
from app.services.dentista_service import buscar_dentistas
from app.services.procedimento_service import buscar_procedimentos
from app.services.horario_service import buscar_horarios
from app.services.consulta_service import agendar_consulta, buscar_consultas
from app.services.paciente_service import buscar_paciente_por_telefone, buscar_pacientes
from datetime import date

load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

SYSTEM_PROMPT = """
Você é o assistente virtual de uma clínica odontológica chamada Dental AI.

Você atende pacientes pelo WhatsApp.

Seu objetivo é ajudar o paciente a agendar consultas.

Se o paciente disser que quer marcar uma consulta, não diga que você não consegue acessar a agenda.
Você terá acesso às funções da clínica posteriormente.

Seja direto, educado e natural.
Não diga que você é uma inteligência artificial, a menos que o paciente pergunte.

Nunca invente procedimentos, dentistas, datas ou horários.

Quando o paciente quiser agendar uma consulta:
1. Consulte as ferramentas disponíveis.
2. Nunca diga que uma consulta foi agendada sem chamar agendar_consulta.
3. Só confirme o agendamento se agendar_consulta retornar sucesso.
4. Se agendar_consulta retornar um erro, informe o erro ao paciente.
5. Nunca altere a data ou horário escolhido pelo paciente.
6. Nunca invente disponibilidade.
7. Se precisar de uma informação para chamar uma ferramenta, pergunte ao paciente.
"""

chats: dict[str, object] = {}

def buscar_procedimentos_para_ia():
    procedimentos = buscar_procedimentos()

    return [
        {
            "id": p["id"],
            "nome": p["nome"],
            "descricao": p["descricao"],
            "duracao_minutos": p["duracao_minutos"],
            "preco": float(p["preco"]),
        }
        for p in procedimentos
    ]

def buscar_horarios_para_ia(
    dentista_id: int,
    procedimento_id: int,
    data: str,
):
    resultado = buscar_horarios(
        dentista_id,
        procedimento_id,
        data,
    )

    if "erro" in resultado:
        return {"erro": resultado["erro"]}

    return {
        "horarios_disponiveis": resultado["horarios_disponiveis"]
    }

def obter_data_atual():
    hoje = date.today()

    return {
        "data": hoje.isoformat(),
        "dia_semana": hoje.strftime("%A"),
    }

def conversar(numero: str, mensagem: str) -> str:
    chat = chats.get(numero)

    def buscar_meu_paciente():
      return buscar_pacientes(numero)

    if chat is None:
      chat = client.chats.create(
          model="gemini-3.8-flash",
          config={
              "system_instruction": SYSTEM_PROMPT,
              "tools": [        
                buscar_procedimentos_para_ia,
                buscar_dentistas,
                buscar_horarios_para_ia,
                agendar_consulta,
                obter_data_atual,
                buscar_meu_paciente
              ]
          },
          
      )
      chats[numero] = chat
    response = chat.send_message(mensagem)
    return response.text
