pra entrar dentro do db:  
docker exec -it dental-ai-postgres psql -U dental_user -d dental_ai

SELECT * FROM dentista_procedimentos ORDER BY procedimento_id;