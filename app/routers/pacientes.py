from fastapi import APIRouter

from app.services.paciente_service import buscar_pacientes


router = APIRouter(
    prefix="/pacientes",
    tags=["Pacientes"]
)


@router.get("")
def listar(telefone: str | None = None):
    return buscar_pacientes(telefone)