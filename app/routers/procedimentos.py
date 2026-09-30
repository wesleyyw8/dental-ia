from fastapi import APIRouter

from app.services.procedimento_service import buscar_procedimentos


router = APIRouter(
    prefix="/procedimentos",
    tags=["Procedimentos"]
)


@router.get("")
def listar():
    return buscar_procedimentos()