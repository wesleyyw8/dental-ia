import re


def normalizar_telefone(telefone: str) -> str:
    numeros = re.sub(r"\D", "", telefone)

    if numeros.startswith("55"):
        return numeros

    return f"55{numeros}"
