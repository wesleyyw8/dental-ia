from datetime import datetime, timedelta

from app.repositories.consulta_repository import (
    buscar_consulta_por_id,
    cancelar_consulta,
    criar_consulta,
    listar_consultas,
    listar_consultas_por_paciente,
    remarcar_consulta,
)
from app.repositories.procedimento_repository import buscar_procedimento_por_id
from app.services.horario_service import buscar_horarios


def agendar_consulta(
    paciente_id: int, dentista_id: int, procedimento_id: int, data: str, horario: str
):
    procedimento = buscar_procedimento_por_id(procedimento_id)

    data_hora_inicio = datetime.strptime(f"{data} {horario}", "%Y-%m-%d %H:%M")

    data_hora_fim = data_hora_inicio + timedelta(
        minutes=procedimento["duracao_minutos"]
    )

    horarios = buscar_horarios(dentista_id, procedimento_id, data)

    if "erro" in horarios:
        return {"erro": horarios["erro"]}

    if horario not in horarios["horarios_disponiveis"]:
        return {"erro": "Horário não disponível"}

    return criar_consulta(
        paciente_id, dentista_id, procedimento_id, data_hora_inicio, data_hora_fim
    )


def buscar_consultas():
    return listar_consultas()


def cancelar_consulta_por_id(consulta_id: int):
    consulta = cancelar_consulta(consulta_id)

    if not consulta:
        return {"erro": "Consulta não encontrada ou já está cancelada"}

    return {
        "mensagem": "Consulta cancelada com sucesso",
        "consulta_id": consulta["id"],
    }


def remarcar_consulta_por_id(consulta_id: int, data: str, horario: str):
    consulta = buscar_consulta_por_id(consulta_id)

    if not consulta:
        return {"erro": "Consulta não encontrada"}

    if consulta["status"] != "agendada":
        return {"erro": "Esta consulta não pode ser remarcada"}

    horarios = buscar_horarios(
        consulta["dentista_id"], consulta["procedimento_id"], data
    )

    if "erro" in horarios:
        return {"erro": horarios["erro"]}

    if horario not in horarios["horarios_disponiveis"]:
        return {"erro": "Horário não disponível"}

    data_hora_inicio = datetime.strptime(f"{data} {horario}", "%Y-%m-%d %H:%M")

    procedimento = buscar_procedimento_por_id(consulta["procedimento_id"])

    data_hora_fim = data_hora_inicio + timedelta(
        minutes=procedimento["duracao_minutos"]
    )

    consulta_atualizada = remarcar_consulta(
        consulta_id, data_hora_inicio, data_hora_fim
    )

    return consulta_atualizada

def buscar_minhas_consultas(paciente_id: int):
    return listar_consultas_por_paciente(paciente_id)

def pode_alterar_consulta(consulta):
    agora = datetime.now()
    tempo_restante = consulta["data_hora_inicio"] - agora

    return tempo_restante >= timedelta(hours=24)
