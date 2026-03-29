# Instrucoes de Deploy do Backend

## Cenario atual

- Backend: Render Web Service
- Banco: Postgres compativel com Prisma
- Frontend: Vercel
- Uploads: armazenamento local em `uploads/`

## Render

### 1. Criar o servico

1. Acesse `https://render.com`
2. Clique em `New Web Service`
3. Conecte o repositorio `SpecFlow`
4. Defina `backend` como `Root Directory`

### 2. Configuracao do servico

- Build Command:

```bash
npm install --include=dev && npx prisma generate && npm run build
```

- Start Command:

```bash
npm run start:prod
```

### 3. Variaveis de ambiente

Cadastre no Render:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DIRECT_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://spec-flow-jet.vercel.app
BACKEND_PUBLIC_URL=https://specflow-backend-6a64.onrender.com
PUBLIC_API_URL=https://specflow-backend-6a64.onrender.com/api
CORS_ORIGIN=http://localhost:3000,https://spec-flow-jet.vercel.app
GOOGLE_CALLBACK_URL=https://specflow-backend-6a64.onrender.com/api/auth/google/callback
```

### 4. Validacao

Depois do deploy, teste:

```text
https://specflow-backend-6a64.onrender.com/api/health
```

Se responder `200`, o backend esta no ar.

## Observacoes

- Em Render free, uploads locais podem ser perdidos em restart ou redeploy.
- Para persistencia de anexos em producao, prefira um storage dedicado.
- O projeto usa Node 20 como base recomendada.
