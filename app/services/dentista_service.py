from app.repositories.dentista_repository import (
    listar_dentistas,
    listar_dentistas_por_procedimento
)

def buscar_dentistas(procedimento_id: int | None = None):
    if procedimento_id is not None:
        return listar_dentistas_por_procedimento(procedimento_id)

    return listar_dentistas()