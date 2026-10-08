from app.database import conectar


def listar_consultas_por_dentista_e_data(dentista_id: int, data: str):
    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute(
            """
                SELECT
                    c.id,

                    p.id AS paciente_id,
                    p.nome AS paciente_nome,

                    d.id AS dentista_id,
                    d.nome AS dentista_nome,

                    pr.id AS procedimento_id,
                    pr.nome AS procedimento_nome,

                    c.data_hora_inicio,
                    c.data_hora_fim,
                    c.status

                FROM consultas c

                INNER JOIN pacientes p
                    ON p.id = c.paciente_id

                INNER JOIN dentistas d
                    ON d.id = c.dentista_id

                INNER JOIN procedimentos pr
                    ON pr.id = c.procedimento_id

                WHERE c.dentista_id = %s
                  AND DATE(c.data_hora_inicio) = %s
                  AND c.status = 'agendada'

                ORDER BY c.data_hora_inicio
            """,
            (dentista_id, data),
        )

        return cursor.fetchall()


def criar_consulta(
    paciente_id: int,
    dentista_id: int,
    procedimento_id: int,
    data_hora_inicio,
    data_hora_fim,
):
    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute(
            """
                INSERT INTO consultas (
                    paciente_id,
                    dentista_id,
                    procedimento_id,
                    data_hora_inicio,
                    data_hora_fim,
                    status
                )
                VALUES (%s, %s, %s, %s, %s, 'agendada')
                RETURNING id
            """,
            (
                paciente_id,
                dentista_id,
                procedimento_id,
                data_hora_inicio,
                data_hora_fim,
            ),
        )

        consulta = cursor.fetchone()

        return consulta


def listar_consultas():
    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute("""
                SELECT
                    c.id,

                    p.id AS paciente_id,
                    p.nome AS paciente_nome,

                    d.id AS dentista_id,
                    d.nome AS dentista_nome,

                    pr.id AS procedimento_id,
                    pr.nome AS procedimento_nome,

                    c.data_hora_inicio,
                    c.data_hora_fim,
                    c.status

                FROM consultas c

                INNER JOIN pacientes p
                    ON p.id = c.paciente_id

                INNER JOIN dentistas d
                    ON d.id = c.dentista_id

                INNER JOIN procedimentos pr
                    ON pr.id = c.procedimento_id

                ORDER BY c.data_hora_inicio
            """)

        return cursor.fetchall()


def cancelar_consulta(consulta_id: int):
    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute(
            """
                UPDATE consultas
                SET status = 'cancelada'
                WHERE id = %s
                  AND status = 'agendada'
                RETURNING id
            """,
            (consulta_id,),
        )

        return cursor.fetchone()


def remarcar_consulta(consulta_id: int, data_hora_inicio, data_hora_fim):
    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute(
            """
                UPDATE consultas
                SET
                    data_hora_inicio = %s,
                    data_hora_fim = %s
                WHERE id = %s
                  AND status = 'agendada'
                RETURNING id
            """,
            (data_hora_inicio, data_hora_fim, consulta_id),
        )

        return cursor.fetchone()


def buscar_consulta_por_id(consulta_id: int):
    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute(
            """
                SELECT
                    id,
                    paciente_id,
                    dentista_id,
                    procedimento_id,
                    data_hora_inicio,
                    data_hora_fim,
                    status
                FROM consultas
                WHERE id = %s
            """,
            (consulta_id,),
        )

        return cursor.fetchone()

def listar_consultas_por_paciente(paciente_id: int):
    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute(
            """
                SELECT
                    c.id,
                    c.paciente_id,
                    c.dentista_id,
                    d.nome AS dentista_nome,
                    c.procedimento_id,
                    pr.nome AS procedimento_nome,
                    c.data_hora_inicio,
                    c.data_hora_fim,
                    c.status
                FROM consultas c
                INNER JOIN dentistas d
                    ON d.id = c.dentista_id
                INNER JOIN procedimentos pr
                    ON pr.id = c.procedimento_id
                WHERE c.paciente_id = %s
                  AND c.status = 'agendada'
                ORDER BY c.data_hora_inicio
            """,
            (paciente_id,),
        )

        return cursor.fetchall()