from app.repositories.disponibilidade_repository import listar_disponibilidades
from app.repositories.consulta_repository import listar_consultas_por_dentista_e_data
from app.repositories.procedimento_repository import buscar_procedimento_por_id
from app.repositories.dentista_repository import dentista_realiza_procedimento
from datetime import datetime, timedelta

def gerar_slots(disponibilidades, duracao_minutos: int):
    slots = []

    for disponibilidade in disponibilidades:
        inicio = datetime.combine(
            disponibilidade["data"],
            disponibilidade["hora_inicio"]
        )

        fim = datetime.combine(
            disponibilidade["data"],
            disponibilidade["hora_fim"]
        )

        horario = inicio

        while horario + timedelta(minutes=duracao_minutos) <= fim:
            slots.append(horario)
            # slots.append(horario.strftime("%H:%M"))
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
    realiza_procedimento = dentista_realiza_procedimento(
      dentista_id,
      procedimento_id
    )
    if not realiza_procedimento:
      return {
          "erro": "Este dentista não realiza esse procedimento"
      }
    
    procedimento = buscar_procedimento_por_id(procedimento_id)
    disponibilidades = listar_disponibilidades(dentista_id, data)

    slots = gerar_slots(
        disponibilidades,
        procedimento["duracao_minutos"]
    )

    consultas = listar_consultas_por_dentista_e_data(
        dentista_id,
        data
    )
    
    slots_disponiveis = []
    for slot in slots:
      if not tem_conflito(
          slot,
          procedimento["duracao_minutos"],
          consultas
      ):
        slots_disponiveis.append(slot)


    return {
        "procedimento": procedimento,
        "disponibilidades": disponibilidades,
        "consultas": consultas,
        "horarios_disponiveis": [
          slot.strftime("%H:%M")
          for slot in slots_disponiveis
        ]
    }