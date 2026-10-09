from app.database import conectar
from app.utils.telefone import normalizar_telefone


def _anexar_procedimentos(conexao, dentistas):
    if not dentistas:
        return dentistas

    dentistas_por_id = {dentista["id"]: dentista for dentista in dentistas}

    for dentista in dentistas:
        dentista["procedimentos"] = []

    with conexao.cursor() as cursor:
        cursor.execute(
            """
                SELECT
                    dp.dentista_id,
                    p.id,
                    p.nome
                FROM dentista_procedimentos dp
                INNER JOIN procedimentos p
                    ON p.id = dp.procedimento_id
                   AND p.ativo = TRUE
                WHERE dp.dentista_id = ANY(%s)
                ORDER BY p.nome
            """,
            (list(dentistas_por_id),),
        )

        for procedimento in cursor.fetchall():
            dentistas_por_id[procedimento["dentista_id"]]["procedimentos"].append(
                {
                    "id": procedimento["id"],
                    "nome": procedimento["nome"],
                }
            )

    return dentistas


def listar_dentistas():
    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute(
            """
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
            """
        )
        dentistas = cursor.fetchall()
        return _anexar_procedimentos(conexao, dentistas)


def buscar_dentista_por_id(dentista_id: int):
    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute(
            """
                SELECT
                    id,
                    nome,
                    especialidade,
                    telefone,
                    email,
                    ativo
                FROM dentistas
                WHERE id = %s
                  AND ativo = TRUE
            """,
            (dentista_id,),
        )
        dentista = cursor.fetchone()

        if not dentista:
            return None

        return _anexar_procedimentos(conexao, [dentista])[0]


def buscar_dentista_por_email(email: str, ignorar_id: int | None = None):
    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute(
            """
                SELECT id
                FROM dentistas
                WHERE LOWER(email) = LOWER(%s)
                  AND (%s IS NULL OR id <> %s)
            """,
            (email, ignorar_id, ignorar_id),
        )
        return cursor.fetchone()


def listar_dentistas_por_procedimento(procedimento_id: int):
    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute(
            """
                SELECT
                    d.id,
                    d.nome,
                    d.especialidade,
                    d.telefone,
                    d.email,
                    d.ativo
                FROM dentistas d
                INNER JOIN dentista_procedimentos dp
                    ON dp.dentista_id = d.id
                INNER JOIN procedimentos p
                    ON p.id = dp.procedimento_id
                WHERE dp.procedimento_id = %s
                  AND d.ativo = TRUE
                  AND p.ativo = TRUE
                ORDER BY d.nome
            """,
            (procedimento_id,),
        )
        dentistas = cursor.fetchall()
        return _anexar_procedimentos(conexao, dentistas)


def _salvar_procedimentos(cursor, dentista_id: int, procedimento_ids: list[int]):
    cursor.execute(
        "DELETE FROM dentista_procedimentos WHERE dentista_id = %s",
        (dentista_id,),
    )
    cursor.execute(
        """
            INSERT INTO dentista_procedimentos (dentista_id, procedimento_id)
            SELECT %s, id
            FROM procedimentos
            WHERE id = ANY(%s)
              AND ativo = TRUE
        """,
        (dentista_id, procedimento_ids),
    )

    if cursor.rowcount != len(procedimento_ids):
        raise ValueError("Um ou mais procedimentos não existem ou estão inativos")


def criar_dentista(
    nome: str,
    especialidade: str,
    telefone: str,
    email: str,
    procedimento_ids: list[int],
):
    telefone = normalizar_telefone(telefone)

    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute(
            """
                INSERT INTO dentistas (
                    nome,
                    especialidade,
                    telefone,
                    email,
                    ativo
                )
                VALUES (%s, %s, %s, %s, TRUE)
                RETURNING id
            """,
            (nome, especialidade, telefone, email),
        )
        dentista_id = cursor.fetchone()["id"]
        _salvar_procedimentos(cursor, dentista_id, procedimento_ids)

    return buscar_dentista_por_id(dentista_id)


def atualizar_dentista(
    dentista_id: int,
    nome: str,
    especialidade: str,
    telefone: str,
    email: str,
    procedimento_ids: list[int],
):
    telefone = normalizar_telefone(telefone)

    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute(
            """
                UPDATE dentistas
                SET
                    nome = %s,
                    especialidade = %s,
                    telefone = %s,
                    email = %s
                WHERE id = %s
                  AND ativo = TRUE
                RETURNING id
            """,
            (nome, especialidade, telefone, email, dentista_id),
        )

        if not cursor.fetchone():
            return None

        _salvar_procedimentos(cursor, dentista_id, procedimento_ids)

    return buscar_dentista_por_id(dentista_id)


def desativar_dentista(dentista_id: int):
    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute(
            """
                UPDATE dentistas
                SET ativo = FALSE
                WHERE id = %s
                  AND ativo = TRUE
                RETURNING id
            """,
            (dentista_id,),
        )
        return cursor.fetchone()


def dentista_realiza_procedimento(dentista_id: int, procedimento_id: int):
    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute(
            """
                SELECT 1
                FROM dentista_procedimentos dp
                INNER JOIN dentistas d
                    ON d.id = dp.dentista_id
                INNER JOIN procedimentos p
                    ON p.id = dp.procedimento_id
                WHERE dp.dentista_id = %s
                  AND dp.procedimento_id = %s
                  AND d.ativo = TRUE
                  AND p.ativo = TRUE
            """,
            (dentista_id, procedimento_id),
        )
        return cursor.fetchone() is not None
