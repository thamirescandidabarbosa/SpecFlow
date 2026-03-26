# Instruções para Deploy do Backend no Render

## Render - Plataforma recomendada para o backend

### 1. Preparar o projeto
```bash
# Já foi feito:
# - Dockerfile criado
# - railway.toml configurado
# - Scripts de build prontos
```

### 2. Deploy no Render
1. Acesse: https://render.com/
2. Conecte sua conta GitHub
3. Clique em `New Web Service`
4. Escolha seu repositório `SpecFlow`
5. Use `backend` como `Root Directory`

### 3. Configurar variáveis de ambiente
No Render, vá para `Environment` e adicione:

```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://thamirescandidabarbosa.github.io/SpecFlow
CORS_ORIGIN=https://thamirescandidabarbosa.github.io
NODE_ENV=production
PORT=10000
```

### 4. Comandos do serviço
- Build Command: `npm install && npx prisma generate && npm run build`
- Start Command: `npm run start:prod`
- URL esperada da API: `https://specflow.onrender.com/api`

## Atualizar frontend para usar a API

Após o deploy, atualize o frontend para usar a URL da API:

```typescript
// No arquivo de configuração da API
const API_BASE_URL = 'https://seu-backend.railway.app';
const API_BASE_URL = 'https://specflow.onrender.com/api';
```

## Comandos úteis

```bash
# Build local
npm run build

# Rodar produção local
npm run start:prod

# Ver logs no Render
Use o painel do serviço em https://render.com
```
