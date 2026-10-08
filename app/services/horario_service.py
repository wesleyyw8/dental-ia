from datetime import datetime, timedelta

from app.repositories.consulta_repository import listar_consultas_por_dentista_e_data
from app.repositories.dentista_repository import dentista_realiza_procedimento
from app.repositories.disponibilidade_repository import listar_disponibilidades
from app.repositories.procedimento_repository import buscar_procedimento_por_id
from app.services.excecao_agenda_service import buscar_excecoes
from app.services.horario_trabalho_service import buscar_horarios_trabalho


def gerar_slots(horarios_trabalho, data, duracao_minutos: int):
    slots = []

    for horario_trabalho in horarios_trabalho:
        inicio = datetime.combine(data, horario_trabalho["hora_inicio"])

        fim = datetime.combine(data, horario_trabalho["hora_fim"])

        horario = inicio

        while horario + timedelta(minutes=duracao_minutos) <= fim:
            slots.append(horario)
            horario += timedelta(minutes=30)

    return slots


def tem_conflito(slot_inicio, duracao_minutos: int, consultas):
    slot_fim = slot_inicio + timedelta(minutes=duracao_minutos)

    for consulta in consultas:
        consulta_inicio = consulta["data_hora_inicio"]
        consulta_fim = consulta["data_hora_fim"]

        if slot_inicio < consulta_fim and slot_fim > consulta_inicio:
            return True

    return False


def buscar_horarios(dentista_id: int, procedimento_id: int, data: str):
    data_obj = datetime.strptime(data, "%Y-%m-%d")

    if data_obj.isoweekday() in (6, 7):
        return {"erro": "A clínica não realiza atendimentos aos finais de semana"}

    realiza_procedimento = dentista_realiza_procedimento(dentista_id, procedimento_id)
    if not realiza_procedimento:
        return {"erro": "Este dentista não realiza esse procedimento"}

    procedimento = buscar_procedimento_por_id(procedimento_id)
    disponibilidades = listar_disponibilidades(dentista_id, data)

    dia_semana = data_obj.isoweekday()
    horarios_trabalho = buscar_horarios_trabalho(dentista_id, dia_semana)

    excecoes = buscar_excecoes(dentista_id, data)

    slots = gerar_slots(
        horarios_trabalho, data_obj.date(), procedimento["duracao_minutos"]
    )

    consultas = listar_consultas_por_dentista_e_data(dentista_id, data)

    slots_disponiveis = []
    for slot in slots:
        if tem_conflito_com_excecao(slot, procedimento["duracao_minutos"], excecoes):
            continue
        if not tem_conflito(slot, procedimento["duracao_minutos"], consultas):
            slots_disponiveis.append(slot)

    return {
        "procedimento": procedimento,
        "disponibilidades": disponibilidades,
        "consultas": consultas,
        "horarios_disponiveis": [slot.strftime("%H:%M") for slot in slots_disponiveis],
    }


def tem_conflito_com_excecao(slot, duracao_minutos, excecoes):
    fim_slot = slot + timedelta(minutes=duracao_minutos)

    for excecao in excecoes:
        if excecao["tipo"] == "folga":
            return True

        inicio_excecao = datetime.combine(slot.date(), excecao["hora_inicio"])

        fim_excecao = datetime.combine(slot.date(), excecao["hora_fim"])

        if slot < fim_excecao and fim_slot > inicio_excecao:
            return True

    return False
