from fastapi import FastAPI

from app.routers.consultas import router as consultas_router
from app.routers.dentistas import router as dentistas_router
from app.routers.disponibilidades import router as disponibilidades_router
from app.routers.horarios import router as horarios_router
from app.routers.pacientes import router as pacientes_router
from app.routers.procedimentos import router as procedimentos_router

app = FastAPI(title="Dental AI API", version="0.1.0")

app.include_router(dentistas_router)
app.include_router(disponibilidades_router)
app.include_router(horarios_router)
app.include_router(consultas_router)
app.include_router(pacientes_router)
app.include_router(procedimentos_router)
