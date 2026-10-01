from fastapi import APIRouter
from pydantic import BaseModel

from app.services.paciente_service import buscar_pacientes, cadastrar_paciente

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
