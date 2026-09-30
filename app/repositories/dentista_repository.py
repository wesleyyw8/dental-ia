from app.database import conectar


def listar_dentistas():
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute("""
                SELECT
                    id,
                    nome,
                    especialidade,
                    telefone,
                    email,
                    ativo
                FROM dentistas
                WHERE ativo = TRUE
                ORDER BY nome
            """)

            return cursor.fetchall()

def listar_dentistas_por_procedimento(procedimento_id: int):
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute("""
                SELECT
                    d.id,
                    d.nome,
                    d.especialidade,
                    d.telefone,
                    d.email
                FROM dentistas d
                INNER JOIN dentista_procedimentos dp
                    ON dp.dentista_id = d.id
                WHERE dp.procedimento_id = %s
                  AND d.ativo = TRUE
                ORDER BY d.nome
            """, (procedimento_id,))

            return cursor.fetchall()

def dentista_realiza_procedimento(
    dentista_id: int,
    procedimento_id: int
):
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute("""
                SELECT 1
                FROM dentista_procedimentos
                WHERE dentista_id = %s
                  AND procedimento_id = %s
            """, (dentista_id, procedimento_id))

            return cursor.fetchone() is not None