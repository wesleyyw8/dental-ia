from app.repositories.disponibilidade_repository import listar_disponibilidades


def buscar_disponibilidades(dentista_id: int, data: str):
    return listar_disponibilidades(dentista_id, data)