from app.database import conectar


def buscar_procedimento_por_id(procedimento_id: int):
    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute(
            """
                SELECT
                    id,
                    nome,
                    descricao,
                    duracao_minutos,
                    preco
                FROM procedimentos
                WHERE id = %s
                  AND ativo = TRUE
            """,
            (procedimento_id,),
        )

        return cursor.fetchone()


def listar_procedimentos():
    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute("""
                SELECT
                    id,
                    nome,
                    descricao,
                    duracao_minutos,
                    preco,
                    ativo
                FROM procedimentos
                WHERE ativo = TRUE
                ORDER BY nome
            """)

        return cursor.fetchall()


def criar_procedimento(nome: str, descricao: str, duracao_minutos: int, preco: float):
    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute(
            """
                INSERT INTO procedimentos (
                    nome,
                    descricao,
                    duracao_minutos,
                    preco,
                    ativo
                )
                VALUES (%s, %s, %s, %s, TRUE)
                RETURNING
                    id,
                    nome,
                    descricao,
                    duracao_minutos,
                    preco,
                    ativo
            """,
            (nome, descricao, duracao_minutos, preco),
        )

        return cursor.fetchone()


def atualizar_procedimento(
    procedimento_id: int, nome: str, descricao: str, duracao_minutos: int, preco: float
):
    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute(
            """
                UPDATE procedimentos
                SET
                    nome = %s,
                    descricao = %s,
                    duracao_minutos = %s,
                    preco = %s
                WHERE id = %s
                  AND ativo = TRUE
                RETURNING
                    id,
                    nome,
                    descricao,
                    duracao_minutos,
                    preco,
                    ativo
            """,
            (nome, descricao, duracao_minutos, preco, procedimento_id),
        )

        return cursor.fetchone()


def desativar_procedimento(procedimento_id: int):
    with conectar() as conexao, conexao.cursor() as cursor:
        cursor.execute(
            """
                UPDATE procedimentos
                SET ativo = FALSE
                WHERE id = %s
                  AND ativo = TRUE
                RETURNING
                    id,
                    nome,
                    descricao,
                    duracao_minutos,
                    preco,
                    ativo
            """,
            (procedimento_id,),
        )

        return cursor.fetchone()
