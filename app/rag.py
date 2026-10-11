import os

from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

load_dotenv()

embeddings = GoogleGenerativeAIEmbeddings(
    model="gemini-embedding-001",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
)

db = Chroma(
  collection_name="clinica",
  embedding_function=embeddings,
  persist_directory="./chroma_db",
)


def buscar_informacoes_clinica(pergunta: str):
    resultados = db.similarity_search(pergunta, k=1)

    return [
        resultado.page_content
        for resultado in resultados
    ]