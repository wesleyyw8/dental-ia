#!/bin/bash

BASE_URL="http://127.0.0.1:8000"

echo "===== GET /pacientes ====="
curl -s "$BASE_URL/pacientes"
echo -e "\n\n"

echo "===== GET /pacientes?telefone ====="
curl -s "$BASE_URL/pacientes?telefone=11988880001"
echo -e "\n\n"

echo "===== GET /procedimentos ====="
curl -s "$BASE_URL/procedimentos"
echo -e "\n\n"

echo "===== GET /dentistas ====="
curl -s "$BASE_URL/dentistas"
echo -e "\n\n"

echo "===== GET /dentistas?procedimento_id=2 ====="
curl -s "$BASE_URL/dentistas?procedimento_id=2"
echo -e "\n\n"

echo "===== GET /dentistas?procedimento_id=5 ====="
curl -s "$BASE_URL/dentistas?procedimento_id=5"
echo -e "\n\n"

echo "===== GET /disponibilidades ====="
curl -s "$BASE_URL/disponibilidades?dentista_id=2&data=2026-09-29"
echo -e "\n\n"

echo "===== GET /horarios ====="
curl -s "$BASE_URL/horarios?dentista_id=2&procedimento_id=5&data=2026-09-29"
echo -e "\n\n"

echo "===== GET /consultas ====="
curl -s "$BASE_URL/consultas"
echo -e "\n\n"