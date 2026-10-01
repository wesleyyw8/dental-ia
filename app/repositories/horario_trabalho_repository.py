from app.database import conectar


def listar_horarios_trabalho(dentista_id: int, dia_semana: int):
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute("""
                SELECT
                    id,
                    dentista_id,
                    dia_semana,
                    hora_inicio,
                    hora_fim
                FROM horarios_trabalho
                WHERE dentista_id = %s
                  AND dia_semana = %s
                ORDER BY hora_inicio
            """, (dentista_id, dia_semana))

            return cursor.fetchall()