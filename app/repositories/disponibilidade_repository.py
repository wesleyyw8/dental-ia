from app.database import conectar


def listar_disponibilidades(dentista_id: int, data: str):
    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute(
            """
                SELECT
                    id,
                    dentista_id,
                    data,
                    hora_inicio,
                    hora_fim
                FROM disponibilidades
                WHERE dentista_id = %s
                  AND data = %s
                ORDER BY hora_inicio
            """,
            (dentista_id, data),
        )

        return cursor.fetchall()
