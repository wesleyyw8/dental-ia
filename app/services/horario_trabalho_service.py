from app.repositories.horario_trabalho_repository import (
    listar_horarios_trabalho
)


def buscar_horarios_trabalho(
    dentista_id: int,
    dia_semana: int
):
    return listar_horarios_trabalho(
        dentista_id,
        dia_semana
    )