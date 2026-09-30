from app.repositories.paciente_repository import (
    listar_pacientes,
    buscar_paciente_por_telefone
)


def buscar_pacientes(telefone: str | None = None):
    if telefone is not None:
        return buscar_paciente_por_telefone(telefone)

    return listar_pacientes()