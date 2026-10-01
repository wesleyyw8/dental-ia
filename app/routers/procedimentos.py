from fastapi import APIRouter
from pydantic import BaseModel

from app.services.procedimento_service import (
    buscar_procedimentos,
    cadastrar_procedimento,
    editar_procedimento,
)

router = APIRouter(prefix="/procedimentos", tags=["Procedimentos"])


@router.get("")
def listar():
    return buscar_procedimentos()


class ProcedimentoRequest(BaseModel):
    nome: str
    descricao: str
    duracao_minutos: int
    preco: float


@router.post("")
def criar(request: ProcedimentoRequest):
    return cadastrar_procedimento(
        request.nome, request.descricao, request.duracao_minutos, request.preco
    )


@router.put("/{procedimento_id}")
def editar(procedimento_id: int, request: ProcedimentoRequest):
    return editar_procedimento(
        procedimento_id,
        request.nome,
        request.descricao,
        request.duracao_minutos,
        request.preco,
    )
