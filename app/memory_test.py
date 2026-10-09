import json

chats = {
    "353838241303": [
        {"role": "user", "text": "Oi"},
        {"role": "model", "text": "Olá!"},
        {"role": "user", "text": "Quero marcar uma consulta"},
    ]
}

dados = json.dumps(chats)

print(json.dumps(chats, indent=2, ensure_ascii=False))
print(type(dados))

chats_restaurados = json.loads(dados)

print(chats_restaurados)
print(type(chats_restaurados))