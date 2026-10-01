from app.repositories.procedimento_repository import (
    atualizar_procedimento,
    criar_procedimento,
    listar_procedimentos,
    desativar_procedimento
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

def desativar_procedimento_por_id(procedimento_id: int):
    procedimento = desativar_procedimento(procedimento_id)

    if not procedimento:
        return {
            "erro": "Procedimento não encontrado ou já está inativo"
        }

    return {
        "mensagem": "Procedimento desativado com sucesso",
        "procedimento_id": procedimento["id"]
    }