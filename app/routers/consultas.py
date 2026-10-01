from fastapi import APIRouter
from pydantic import BaseModel

from app.services.consulta_service import agendar_consulta
from app.services.consulta_service import (
    agendar_consulta,
    buscar_consultas
)
from app.services.consulta_service import cancelar_consulta_por_id

router = APIRouter(
    prefix="/consultas",
    tags=["Consultas"]
)


class NovaConsulta(BaseModel):
    paciente_id: int
    dentista_id: int
    procedimento_id: int
    data: str
    horario: str


@router.post("")
def criar(consulta: NovaConsulta):
    return agendar_consulta(
        consulta.paciente_id,
        consulta.dentista_id,
        consulta.procedimento_id,
        consulta.data,
        consulta.horario
    )

@router.get("")
def listar():
    return buscar_consultas()

@router.patch("/{consulta_id}/cancelar")
def cancelar(consulta_id: int):
    return cancelar_consulta_por_id(consulta_id)