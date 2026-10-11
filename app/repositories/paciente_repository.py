from app.database import conectar
from app.utils.telefone import normalizar_telefone

def buscar_paciente_por_id(paciente_id: int):
    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute(
            """
                SELECT
                    id,
                    nome,
                    telefone,
                    email
                FROM pacientes
                WHERE id = %s
            """,
            (paciente_id,),
        )

        return cursor.fetchone()

def listar_pacientes():
    with conectar() as conexao, conexao.cursor() as cursor:
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


def buscar_paciente_por_telefone(telefone: str, ignorar_id: int | None = None):
    telefone = normalizar_telefone(telefone)
    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute(
            """
                SELECT
                    id,
                    nome,
                    telefone,
                    email
                FROM pacientes
                WHERE telefone = %s
                  AND (%s::integer IS NULL OR id <> %s)
            """,
            (telefone, ignorar_id, ignorar_id),
        )

        return cursor.fetchone()


def buscar_paciente_por_email(email: str, ignorar_id: int | None = None):
    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute(
            """
                SELECT id
                FROM pacientes
                WHERE LOWER(email) = LOWER(%s)
                  AND (%s::integer IS NULL OR id <> %s)
            """,
            (email, ignorar_id, ignorar_id),
        )

        return cursor.fetchone()


def criar_paciente(nome: str, telefone: str, email: str):
    telefone = normalizar_telefone(telefone)
    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute(
            """
                INSERT INTO pacientes (
                    nome,
                    telefone,
                    email
                )
                VALUES (%s, %s, %s)
                RETURNING id, nome, telefone, email
            """,
            (nome, telefone, email),
        )

        return cursor.fetchone()


def atualizar_paciente(paciente_id: int, nome: str, telefone: str, email: str):
    telefone = normalizar_telefone(telefone)

    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute(
            """
                UPDATE pacientes
                SET
                    nome = %s,
                    telefone = %s,
                    email = %s
                WHERE id = %s
                RETURNING id, nome, telefone, email
            """,
            (nome, telefone, email, paciente_id),
        )

        return cursor.fetchone()


def paciente_possui_consultas(paciente_id: int):
    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute(
            """
                SELECT 1
                FROM consultas
                WHERE paciente_id = %s
                LIMIT 1
            """,
            (paciente_id,),
        )

        return cursor.fetchone() is not None


def excluir_paciente(paciente_id: int, excluir_consultas: bool = False):
    with conectar() as conexao, conexao.cursor() as cursor:
        consultas_excluidas = 0

        if excluir_consultas:
            cursor.execute(
                "DELETE FROM consultas WHERE paciente_id = %s",
                (paciente_id,),
            )
            consultas_excluidas = cursor.rowcount

        cursor.execute(
            """
                DELETE FROM pacientes
                WHERE id = %s
                RETURNING id
            """,
            (paciente_id,),
        )

        paciente = cursor.fetchone()

        if not paciente:
            return None

        return {
            "id": paciente["id"],
            "consultas_excluidas": consultas_excluidas,
        }
