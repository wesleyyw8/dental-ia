# Dental AI — Frontend

Interface React para a API da clínica odontológica.

## Executar localmente

Com a API disponível em `http://127.0.0.1:8000`:

```bash
npm install
npm run dev
```

Abra `http://127.0.0.1:5173`.

O endereço da API fica em `.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Durante o desenvolvimento, o Vite encaminha `/api` para esse endereço. Isso permite o uso local sem exigir mudanças de CORS no backend.

## Validação

```bash
npm run lint
npm run build
```
