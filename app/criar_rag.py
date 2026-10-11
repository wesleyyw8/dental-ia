import os
from pathlib import Path

from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()

arquivo = Path("data/conhecimento_clinica.md")

texto = arquivo.read_text(encoding="utf-8")

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
)

chunks = splitter.split_text(texto)

print(f"Total de chunks: {len(chunks)}")

embeddings = GoogleGenerativeAIEmbeddings(
    model="gemini-embedding-001",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
)

db = Chroma(
    collection_name="clinica",
    embedding_function=embeddings,
    persist_directory="./chroma_db",
)

db.delete_collection()

db = Chroma(
    collection_name="clinica",
    embedding_function=embeddings,
    persist_directory="./chroma_db",
)

db.add_texts(chunks)

print("RAG criado com sucesso!")