from app.database import conectar


def buscar_procedimento_por_id(procedimento_id: int):
    with conectar() as conexao:
        with conexao.cursor() as cursor:
            cursor.execute("""
                SELECT
                    id,
                    nome,
                    descricao,
                    duracao_minutos,
                    preco
                FROM procedimentos
                WHERE id = %s
                  AND ativo = TRUE
            """, (procedimento_id,))

            return cursor.fetchone()

def listar_procedimentos():
    with conectar() as conexao:
        with conexao.cursor() as cursor:
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