from fastapi import APIRouter
from pydantic import BaseModel

from app.services.paciente_service import (
    buscar_pacientes,
    cadastrar_paciente,
    editar_paciente,
    excluir_paciente_por_id,
)

router = APIRouter(prefix="/pacientes", tags=["Pacientes"])


@router.get("")
def listar(telefone: str | None = None):
    return buscar_pacientes(telefone)


class PacienteRequest(BaseModel):
    nome: str
    telefone: str
    email: str


@router.post("")
def criar(request: PacienteRequest):
    return cadastrar_paciente(request.nome, request.telefone, request.email)


@router.put("/{paciente_id}")
def editar(paciente_id: int, request: PacienteRequest):
    return editar_paciente(
        paciente_id,
        request.nome,
        request.telefone,
        request.email,
    )


@router.delete("/{paciente_id}")
def excluir(paciente_id: int, excluir_consultas: bool = False):
    return excluir_paciente_por_id(paciente_id, excluir_consultas)
