from app.repositories.paciente_repository import (
    atualizar_paciente,
    buscar_paciente_por_email,
    buscar_paciente_por_telefone,
    criar_paciente,
    excluir_paciente,
    listar_pacientes,
    paciente_possui_consultas,
    buscar_paciente_por_id,
)

from app.redis import redis_client


def buscar_pacientes(telefone: str | None = None):
    if telefone is not None:
        return buscar_paciente_por_telefone(telefone)

    return listar_pacientes()


def cadastrar_paciente(nome: str, telefone: str, email: str):
    paciente_existente = buscar_paciente_por_telefone(telefone)

    if paciente_existente:
        return {"erro": "Já existe um paciente cadastrado com este telefone"}

    if buscar_paciente_por_email(email):
        return {"erro": "Já existe um paciente cadastrado com este e-mail"}

    paciente = criar_paciente(nome, telefone, email)

    return paciente


def editar_paciente(paciente_id: int, nome: str, telefone: str, email: str):
    if buscar_paciente_por_telefone(telefone, ignorar_id=paciente_id):
        return {"erro": "Já existe um paciente cadastrado com este telefone"}

    if buscar_paciente_por_email(email, ignorar_id=paciente_id):
        return {"erro": "Já existe um paciente cadastrado com este e-mail"}

    paciente = atualizar_paciente(paciente_id, nome, telefone, email)

    if not paciente:
        return {"erro": "Paciente não encontrado"}

    return paciente



def excluir_paciente_por_id(paciente_id: int, excluir_consultas: bool = False):
    paciente = buscar_paciente_por_id(paciente_id)

    if not paciente:
        return {"erro": "Paciente não encontrado"}

    if paciente_possui_consultas(paciente_id) and not excluir_consultas:
        return {
            "erro": "Este paciente possui consultas vinculadas. Confirme a exclusão das consultas para continuar"
        }

    telefone = paciente["telefone"]

    paciente = excluir_paciente(
        paciente_id,
        excluir_consultas=excluir_consultas
    )

    redis_client.delete(f"chat:{telefone}")

    return {
        "mensagem": "Paciente excluído com sucesso",
        "paciente_id": paciente["id"],
        "consultas_excluidas": paciente["consultas_excluidas"],
    }