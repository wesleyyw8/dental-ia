from app.database import conectar
from app.utils.telefone import normalizar_telefone

def listar_pacientes():
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute("""
                SELECT
                    id,
                    nome,
                    telefone,
                    email
                FROM pacientes
                ORDER BY nome
            """)

            return cursor.fetchall()

def buscar_paciente_por_telefone(telefone: str):
    telefone = normalizar_telefone(telefone)
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute("""
                SELECT
                    id,
                    nome,
                    telefone,
                    email
                FROM pacientes
                WHERE telefone = %s
            """, (telefone,))

            return cursor.fetchone()

def criar_paciente(nome: str, telefone: str, email: str):
    telefone = normalizar_telefone(telefone)
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute("""
                INSERT INTO pacientes (
                    nome,
                    telefone,
                    email
                )
                VALUES (%s, %s, %s)
                RETURNING id, nome, telefone, email
            """, (nome, telefone, email))

            return cursor.fetchone()