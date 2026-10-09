from fastapi import APIRouter
from pydantic import BaseModel

from app.services.dentista_service import (
    buscar_dentistas,
    cadastrar_dentista,
    desativar_dentista_por_id,
    editar_dentista,
)

router = APIRouter(prefix="/dentistas", tags=["Dentistas"])


class DentistaRequest(BaseModel):
    nome: str
    especialidade: str
    telefone: str
    email: str
    procedimento_ids: list[int]


@router.get("")
def listar(procedimento_id: int | None = None):
    return buscar_dentistas(procedimento_id)


@router.post("")
def criar(request: DentistaRequest):
    return cadastrar_dentista(
        request.nome,
        request.especialidade,
        request.telefone,
        request.email,
        request.procedimento_ids,
    )


@router.put("/{dentista_id}")
def editar(dentista_id: int, request: DentistaRequest):
    return editar_dentista(
        dentista_id,
        request.nome,
        request.especialidade,
        request.telefone,
        request.email,
        request.procedimento_ids,
    )


@router.patch("/{dentista_id}/desativar")
def desativar(dentista_id: int):
    return desativar_dentista_por_id(dentista_id)
