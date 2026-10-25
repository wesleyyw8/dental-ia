FROM python:3.12-slim

WORKDIR /app

# Instala o uv
RUN pip install --no-cache-dir uv

# Copia os arquivos de dependências primeiro
COPY pyproject.toml uv.lock ./

# Instala as dependências
RUN uv sync --frozen --no-dev

# Copia o código da aplicação
COPY app ./app
COPY data ./data

# Porta do FastAPI
EXPOSE 8000

# Inicia a aplicação
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]