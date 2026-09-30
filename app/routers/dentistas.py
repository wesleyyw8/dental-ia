from fastapi import APIRouter

from app.services.dentista_service import buscar_dentistas


router = APIRouter(
    prefix="/dentistas",
    tags=["Dentistas"]
)


@router.get("")
def listar(procedimento_id: int | None = None):
    return buscar_dentistas(procedimento_id)