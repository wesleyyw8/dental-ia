# Dental AI — API Specification

Base URL:

http://127.0.0.1:8000

---

## GET /pacientes

Lista todos os pacientes.

### Response

[
  {
    "id": 2,
    "nome": "João Santos",
    "telefone": "5511988880002",
    "email": "joao@email.com"
  },
  {
    "id": 1,
    "nome": "Wesley Rebelo",
    "telefone": "5511988880001",
    "email": "wesley@email.com"
  }
]

---

## GET /pacientes?telefone={telefone}

Busca um paciente pelo telefone.

O telefone é normalizado pelo backend, portanto diferentes formatos do mesmo número são tratados como o mesmo telefone.

### Example

GET /pacientes?telefone=11988880001

### Response

{
  "id": 1,
  "nome": "Wesley Rebelo",
  "telefone": "5511988880001",
  "email": "wesley@email.com"
}

---

## POST /pacientes

Cadastra um novo paciente.

### Request

{
  "nome": "Maria Oliveira",
  "telefone": "(11) 92012-4643",
  "email": "maria@email.com"
}

### Successful response

{
  "id": 3,
  "nome": "Maria Oliveira",
  "telefone": "5511920124643",
  "email": "maria@email.com"
}

### Duplicate phone

{
  "erro": "Já existe um paciente cadastrado com este telefone"
}

---

## GET /procedimentos

Lista os procedimentos ativos.

### Response

[
  {
    "id": 1,
    "nome": "Avaliação",
    "descricao": "Consulta inicial para avaliação odontológica",
    "duracao_minutos": 30,
    "preco": 150.0,
    "ativo": true
  },
  {
    "id": 3,
    "nome": "Clareamento",
    "descricao": "Clareamento dentário",
    "duracao_minutos": 60,
    "preco": 600.0,
    "ativo": true
  },
  {
    "id": 5,
    "nome": "Instalação de aparelho",
    "descricao": "Instalação de aparelho ortodôntico",
    "duracao_minutos": 90,
    "preco": 800.0,
    "ativo": true
  },
  {
    "id": 2,
    "nome": "Limpeza",
    "descricao": "Limpeza e profilaxia dentária",
    "duracao_minutos": 60,
    "preco": 250.0,
    "ativo": true
  },
  {
    "id": 4,
    "nome": "Manutenção ortodôntica",
    "descricao": "Manutenção do aparelho ortodôntico",
    "duracao_minutos": 30,
    "preco": 180.0,
    "ativo": true
  }
]

---

## GET /dentistas

Lista todos os dentistas.

### Response

[
  {
    "id": 1,
    "nome": "Dra. Ana Silva",
    "especialidade": "Clínico Geral",
    "telefone": "11999990001",
    "email": "ana@dentalai.com",
    "ativo": true
  },
  {
    "id": 2,
    "nome": "Dr. Carlos Souza",
    "especialidade": "Ortodontia",
    "telefone": "11999990002",
    "email": "carlos@dentalai.com",
    "ativo": true
  }
]

---

## GET /dentistas?procedimento_id={procedimento_id}

Lista os dentistas que realizam determinado procedimento.

### Example

GET /dentistas?procedimento_id=2

### Response

[
  {
    "id": 1,
    "nome": "Dra. Ana Silva",
    "especialidade": "Clínico Geral",
    "telefone": "11999990001",
    "email": "ana@dentalai.com"
  },
  {
    "id": 2,
    "nome": "Dr. Carlos Souza",
    "especialidade": "Ortodontia",
    "telefone": "11999990002",
    "email": "carlos@dentalai.com"
  }
]

---

## GET /disponibilidades

Retorna os períodos de disponibilidade cadastrados para um dentista em uma determinada data.

### Query parameters

- dentista_id
- data

### Example

GET /disponibilidades?dentista_id=2&data=2026-09-29

### Response

[
  {
    "id": 3,
    "dentista_id": 2,
    "data": "2026-09-29",
    "hora_inicio": "08:00:00",
    "hora_fim": "12:00:00"
  },
  {
    "id": 4,
    "dentista_id": 2,
    "data": "2026-09-29",
    "hora_inicio": "13:00:00",
    "hora_fim": "17:00:00"
  }
]

---

## GET /horarios

Retorna os horários disponíveis para um dentista realizar determinado procedimento em uma determinada data.

O cálculo considera:

- horário de trabalho do dentista;
- exceções/folgas;
- bloqueios de períodos;
- consultas já agendadas;
- duração do procedimento;
- se o dentista realiza o procedimento.

### Query parameters

- dentista_id
- procedimento_id
- data

### Example

GET /horarios?dentista_id=2&procedimento_id=5&data=2026-10-05

### Response

{
  "procedimento": {
    "id": 5,
    "nome": "Instalação de aparelho",
    "descricao": "Instalação de aparelho ortodôntico",
    "duracao_minutos": 90,
    "preco": 800.0
  },
  "disponibilidades": [],
  "consultas": [],
  "horarios_disponiveis": [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30"
  ]
}

### Invalid dentist/procedure combination

{
  "erro": "Este dentista não realiza esse procedimento"
}

### Full day exception

Quando o dentista estiver de folga durante todo o dia:

{
  "horarios_disponiveis": []
}

### Period exception

Quando existir um bloqueio parcial, somente os horários fora do período bloqueado serão retornados.

---

## GET /consultas

Lista todas as consultas.

### Response

[
  {
    "id": 2,
    "paciente_id": 2,
    "paciente_nome": "João Santos",
    "dentista_id": 2,
    "dentista_nome": "Dr. Carlos Souza",
    "procedimento_id": 2,
    "procedimento_nome": "Limpeza",
    "data_hora_inicio": "2026-09-29T09:00:00",
    "data_hora_fim": "2026-09-29T10:00:00",
    "status": "agendada"
  },
  {
    "id": 4,
    "paciente_id": 2,
    "paciente_nome": "João Santos",
    "dentista_id": 2,
    "dentista_nome": "Dr. Carlos Souza",
    "procedimento_id": 5,
    "procedimento_nome": "Instalação de aparelho",
    "data_hora_inicio": "2026-09-29T10:00:00",
    "data_hora_fim": "2026-09-29T11:30:00",
    "status": "agendada"
  },
  {
    "id": 1,
    "paciente_id": 1,
    "paciente_nome": "Wesley Rebelo",
    "dentista_id": 1,
    "dentista_nome": "Dra. Ana Silva",
    "procedimento_id": 2,
    "procedimento_nome": "Limpeza",
    "data_hora_inicio": "2026-09-29T14:00:00",
    "data_hora_fim": "2026-09-29T15:00:00",
    "status": "agendada"
  },
  {
    "id": 3,
    "paciente_id": 1,
    "paciente_nome": "Wesley Rebelo",
    "dentista_id": 2,
    "dentista_nome": "Dr. Carlos Souza",
    "procedimento_id": 5,
    "procedimento_nome": "Instalação de aparelho",
    "data_hora_inicio": "2026-09-29T14:00:00",
    "data_hora_fim": "2026-09-29T15:30:00",
    "status": "agendada"
  }
]

---

## POST /consultas

Cria uma nova consulta.

### Request

{
  "paciente_id": 2,
  "dentista_id": 2,
  "procedimento_id": 5,
  "data": "2026-09-29",
  "horario": "10:00"
}

### Successful response

A API retorna o ID da consulta criada.

### Unavailable time

{
  "erro": "Horário não disponível"
}

### Invalid dentist/procedure combination

{
  "erro": "Este dentista não realiza esse procedimento"
}

---

## PATCH /consultas/{consulta_id}/cancelar

Cancela uma consulta agendada.

### Example

PATCH /consultas/1/cancelar

### Successful response

{
  "mensagem": "Consulta cancelada com sucesso",
  "consulta_id": 1
}

### Consultation not found or already cancelled

{
  "erro": "Consulta não encontrada ou já está cancelada"
}

---

## PATCH /consultas/{consulta_id}/remarcar

Remarca uma consulta existente para uma nova data e horário.

A consulta mantém o mesmo:

- paciente;
- dentista;
- procedimento.

Somente a data e o horário são alterados.

O novo horário passa pela mesma validação de disponibilidade utilizada no agendamento.

### Query parameters

- data
- horario

### Example

PATCH /consultas/1/remarcar?data=2026-10-05&horario=08:00

### Successful response

{
  "id": 1
}

### Consultation not found

{
  "erro": "Consulta não encontrada"
}

### Consultation cannot be rescheduled

{
  "erro": "Esta consulta não pode ser remarcada"
}

### Unavailable time

{
  "erro": "Horário não disponível"
}