from app.repositories.paciente_repository import (
    listar_pacientes,
    buscar_paciente_por_telefone
)
from app.repositories.paciente_repository import criar_paciente
from app.repositories.paciente_repository import buscar_paciente_por_telefone


def buscar_pacientes(telefone: str | None = None):
    if telefone is not None:
        return buscar_paciente_por_telefone(telefone)

    return listar_pacientes()


def cadastrar_paciente(nome: str, telefone: str, email: str):
    paciente_existente = buscar_paciente_por_telefone(telefone)

    if paciente_existente:
      return {
          "erro": "Já existe um paciente cadastrado com este telefone"
      }
    
    paciente = criar_paciente(
        nome,
        telefone,
        email
    )

    return paciente