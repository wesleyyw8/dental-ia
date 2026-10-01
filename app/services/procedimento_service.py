from app.repositories.procedimento_repository import (
    atualizar_procedimento,
    criar_procedimento,
    listar_procedimentos,
)


def buscar_procedimentos():
    return listar_procedimentos()


def cadastrar_procedimento(
    nome: str, descricao: str, duracao_minutos: int, preco: float
):
    return criar_procedimento(nome, descricao, duracao_minutos, preco)


def editar_procedimento(
    procedimento_id: int, nome: str, descricao: str, duracao_minutos: int, preco: float
):
    procedimento = atualizar_procedimento(
        procedimento_id, nome, descricao, duracao_minutos, preco
    )

    if not procedimento:
        return {"erro": "Procedimento não encontrado ou está inativo"}

    return procedimento
