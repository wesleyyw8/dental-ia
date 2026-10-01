from app.repositories.excecao_agenda_repository import (
    listar_excecoes_por_dentista_e_data
)


def buscar_excecoes(
    dentista_id: int,
    data: str
):
    return listar_excecoes_por_dentista_e_data(
        dentista_id,
        data
    )