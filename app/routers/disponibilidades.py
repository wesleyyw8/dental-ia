from fastapi import APIRouter

from app.services.disponibilidade_service import buscar_disponibilidades

router = APIRouter(prefix="/disponibilidades", tags=["Disponibilidades"])


@router.get("")
def listar(dentista_id: int, data: str):
    return buscar_disponibilidades(dentista_id, data)
