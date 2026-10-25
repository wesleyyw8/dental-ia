pra entrar dentro do db:  
docker exec -it dental-ai-postgres psql -U dental_user -d dental_ai

SELECT * FROM dentista_procedimentos ORDER BY procedimento_id;


ngrok pra fazer o tunel do https pro localhost

criar a rag: 
uv run python -m app.criar_rag

## 🧠 PLANO DE ESTUDOS

### 1. IA / BACKEND
- [x] Redis
- [x] RAG
- [x] Embeddings
- [x] Chroma
- [x] LLM / integração com IA
- [x] Histórico de conversa
- [x] Múltiplas instâncias Python
- [x] Redis compartilhado
- [x] Fallback quando Redis cai
- [x] Testes de recuperação

### 2. 🗄️ BANCO DE DADOS
- [x] Relacional vs NoSQL
- [x] Normalização / desnormalização
- [x] Primary Key / Foreign Key
- [x] Índices / B-tree
- [x] Full Table Scan / Index Scan
- [x] EXPLAIN
- [x] Índices compostos
- [x] N+1
- [x] Transactions
- [x] ACID
- [x] Isolation Levels
- [x] Dirty Read / Non-repeatable Read / Phantom Read
- [x] Locks
- [x] Deadlocks
- [x] Connection Pool
- [x] Replication
- [x] Read Replica
- [x] Replication Lag
- [x] Vertical / Horizontal Scaling
- [x] Sharding
- [x] Shard Key
- [x] Quiz — 17/20

### 3. ⚙️ INFRA / SISTEMAS DISTRIBUÍDOS
- [x] Caching
- [x] Cache hit / miss
- [x] Cache invalidation
- [x] Cache stampede
- [x] Load Balancer
- [x] API Gateway
- [x] Rate Limiting
- [x] Message Queue
- [x] Event-Driven Architecture
- [x] Observability
- [x] Logs / Metrics / Traces
- [x] Fault Tolerance
- [x] High Availability
- [x] Quiz fácil — 20/20
- [x] Quiz nível entrevista — 18/20

### 4. 🐳 DOCKER / VPS / DEVOPS
- [ ] Docker
- [ ] Docker Compose
- [ ] Containerizar o Dental AI
- [ ] Subir PostgreSQL + Redis + Python com Docker Compose
- [ ] Simular múltiplas instâncias do Python
- [ ] Nginx como Load Balancer
- [ ] Fazer deploy do Dental AI na VPS
- [ ] Configurar Nginx
- [ ] HTTPS / Certbot
- [ ] Domínio
- [ ] Firewall / UFW
- [ ] Logs da aplicação
- [ ] Monitoramento básico
- [ ] Jenkins
- [ ] Pipeline CI/CD
- [ ] Jenkins rodando testes
- [ ] Jenkins fazendo build da imagem Docker
- [ ] Jenkins fazendo deploy automático na VPS
- [ ] Simular falha e recovery do deploy

### 5. 🏗️ SYSTEM DESIGN
- [ ] Como começar um System Design
- [ ] Requisitos funcionais
- [ ] Requisitos não funcionais
- [ ] Estimativa de carga
- [ ] Throughput / Latência
- [ ] Capacidade
- [ ] Identificar gargalos
- [ ] Escolher banco
- [ ] Escolher cache
- [ ] Escolher Queue
- [ ] Load Balancing
- [ ] Scaling
- [ ] Consistência vs disponibilidade
- [ ] Fault Tolerance
- [ ] Trade-offs
- [ ] Desenhar arquitetura completa
- [ ] System Design de aplicações reais
- [ ] Simulações de entrevista

### 6. 🦷 APLICAÇÃO FINAL — DENTAL AI
- [ ] Revisar arquitetura atual
- [ ] Identificar gargalos
- [ ] Definir estratégia de escala
- [ ] Definir componentes necessários
- [ ] Melhorar arquitetura
- [ ] Dockerizar
- [ ] Colocar na VPS
- [ ] Nginx
- [ ] Jenkins
- [ ] CI/CD
- [ ] Deploy automático
- [ ] Teste de carga
- [ ] Teste de falhas
- [ ] Observabilidade
- [ ] Documentar arquitetura
- [ ] Usar o Dental AI como projeto de System Design