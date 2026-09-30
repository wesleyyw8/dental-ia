from fastapi import APIRouter

from app.services.horario_service import buscar_horarios


router = APIRouter(
    prefix="/horarios",
    tags=["Horários"]
)


@router.get("")
def listar(dentista_id: int, procedimento_id: int, data: str):
    return buscar_horarios(dentista_id, procedimento_id, data)