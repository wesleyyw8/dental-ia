from app.repositories.dentista_repository import (
    atualizar_dentista,
    buscar_dentista_por_email,
    criar_dentista,
    desativar_dentista,
    listar_dentistas,
    listar_dentistas_por_procedimento,
)


def buscar_dentistas(procedimento_id: int | None = None):
    if procedimento_id is not None:
        return listar_dentistas_por_procedimento(procedimento_id)

    return listar_dentistas()


def _normalizar_procedimento_ids(procedimento_ids: list[int]):
    return sorted(set(procedimento_ids))


def cadastrar_dentista(
    nome: str,
    especialidade: str,
    telefone: str,
    email: str,
    procedimento_ids: list[int],
):
    procedimento_ids = _normalizar_procedimento_ids(procedimento_ids)

    if not procedimento_ids:
        return {"erro": "Selecione pelo menos um procedimento"}

    if buscar_dentista_por_email(email):
        return {"erro": "Já existe um profissional cadastrado com este e-mail"}

    try:
        return criar_dentista(
            nome,
            especialidade,
            telefone,
            email,
            procedimento_ids,
        )
    except ValueError as erro:
        return {"erro": str(erro)}


def editar_dentista(
    dentista_id: int,
    nome: str,
    especialidade: str,
    telefone: str,
    email: str,
    procedimento_ids: list[int],
):
    procedimento_ids = _normalizar_procedimento_ids(procedimento_ids)

    if not procedimento_ids:
        return {"erro": "Selecione pelo menos um procedimento"}

    if buscar_dentista_por_email(email, ignorar_id=dentista_id):
        return {"erro": "Já existe um profissional cadastrado com este e-mail"}

    try:
        dentista = atualizar_dentista(
            dentista_id,
            nome,
            especialidade,
            telefone,
            email,
            procedimento_ids,
        )
    except ValueError as erro:
        return {"erro": str(erro)}

    if not dentista:
        return {"erro": "Profissional não encontrado ou está inativo"}

    return dentista


def desativar_dentista_por_id(dentista_id: int):
    dentista = desativar_dentista(dentista_id)

    if not dentista:
        return {"erro": "Profissional não encontrado ou já está inativo"}

    return {
        "mensagem": "Profissional desativado com sucesso",
        "dentista_id": dentista["id"],
    }
