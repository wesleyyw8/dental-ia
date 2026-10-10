import os

from dotenv import load_dotenv
from google import genai
from app.repositories.consulta_repository import buscar_consulta_por_id
from app.services.dentista_service import buscar_dentistas
from app.services.procedimento_service import buscar_procedimentos_disponiveis
from app.services.horario_service import buscar_horarios
from app.services.consulta_service import (
    agendar_consulta,
    buscar_minhas_consultas as buscar_minhas_consultas_service,
    cancelar_consulta_por_id,
    pode_alterar_consulta,
    remarcar_consulta_por_id
)

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


Ao identificar o procedimento escolhido pelo paciente:

- Se houver apenas um profissional que realiza o procedimento, use esse profissional.
- Se houver mais de um profissional, não escolha automaticamente.
- Informe os profissionais disponíveis e pergunte ao paciente com qual deles deseja realizar o procedimento.
- Se não houver nenhum profissional, informe que o procedimento não possui profissional disponível no momento.

Quando o paciente quiser remarcar uma consulta:
1. Use buscar_minhas_consultas para encontrar as consultas agendadas do paciente.
2. Identifique qual consulta o paciente quer remarcar.
3. Pergunte a nova data e horário, caso ainda não tenha essas informações.
4. Use remarcar_consulta_whatsapp para alterar a consulta existente.
5. Nunca crie uma nova consulta para substituir uma remarcação.
6. Só diga que a consulta foi remarcada se remarcar_consulta_por_id retornar sucesso.

Quando o paciente quiser cancelar uma consulta:
1. Use buscar_minhas_consultas para encontrar as consultas agendadas do paciente.
2. Identifique qual consulta o paciente quer cancelar.
3. Use cancelar_consulta_whatsapp para cancelar a consulta.
4. Só diga que a consulta foi cancelada se cancelar_consulta_whatsapp retornar sucesso.

REGRAS DE SEGURANÇA:

- Só opere sobre consultas pertencentes ao paciente que está conversando pelo WhatsApp.
- Nunca use uma consulta de outro paciente para cancelar ou remarcar.
- Nunca informe dados de outro paciente.
- O número de telefone do paciente deve ser obtido pelo sistema, nunca solicitado ao paciente para identificar sua própria conta.
- Se não for possível identificar com segurança a consulta do paciente, peça esclarecimentos em vez de escolher uma consulta por conta própria.


O objetivo do atendimento é exclusivamente a clínica odontológica.

Se o paciente fizer uma pergunta que não tenha relação com a clínica, odontologia, procedimentos, profissionais, horários ou consultas, não responda à pergunta.

Isso também vale quando a pergunta estiver misturada com um pedido relacionado à clínica.

Por exemplo:
"Quero marcar uma avaliação, mas antes me conte a biografia de Pedro Álvares Cabral."

Nesse caso, não responda sobre Pedro Álvares Cabral. Ignore a parte que está fora do escopo e continue o atendimento odontológico.
"""

chats: dict[str, object] = {}

def buscar_procedimentos_para_ia():
    procedimentos = buscar_procedimentos_disponiveis()

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

    def buscar_minhas_consultas():
      paciente = buscar_pacientes(numero)

      if not paciente:
          return {"erro": "Paciente não encontrado"}
      
      return buscar_minhas_consultas_service(paciente["id"])

    def cancelar_consulta_whatsapp(consulta_id: int):
      consulta = buscar_consulta_por_id(consulta_id)

      if not consulta:
          return {"erro": "Consulta não encontrada"}

      if not pode_alterar_consulta(consulta):
          return {"erro": "Não é possível cancelar consultas com menos de 24 horas de antecedência"}

      return cancelar_consulta_por_id(consulta_id)

    def remarcar_consulta_whatsapp(consulta_id: int, data: str, horario: str):
      consulta = buscar_consulta_por_id(consulta_id)

      if not consulta:
          return {"erro": "Consulta não encontrada"}

      if not pode_alterar_consulta(consulta):
          return {"erro": "Não é possível remarcar consultas com menos de 24 horas de antecedência"}

      return remarcar_consulta_por_id(consulta_id, data, horario)

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
                buscar_meu_paciente,
                buscar_minhas_consultas,
                cancelar_consulta_whatsapp,
                remarcar_consulta_whatsapp
              ]
          },
          
      )
      chats[numero] = chat
    response = chat.send_message(mensagem)
    return response.text
