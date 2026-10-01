from app.database import conectar


def listar_excecoes_por_dentista_e_data(
    dentista_id: int,
    data: str
):
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute("""
                SELECT
                    id,
                    dentista_id,
                    data,
                    hora_inicio,
                    hora_fim,
                    tipo,
                    descricao
                FROM excecoes_agenda
                WHERE dentista_id = %s
                  AND data = %s
                ORDER BY hora_inicio
            """, (dentista_id, data))

            return cursor.fetchall()