from app.database import conectar

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