# Instruções para Deploy do Backend no Railway

## Railway - Plataforma recomendada para o backend

### 1. Preparar o projeto
```bash
# Já foi feito:
# - Dockerfile criado
# - railway.toml configurado
# - Scripts de build prontos
```

### 2. Deploy no Railway
1. Acesse: https://railway.app/
2. Conecte sua conta GitHub
3. Clique em "New Project" 
4. Selecione "Deploy from GitHub repo"
5. Escolha seu repositório SpecFlow
6. Selecione a pasta `fullstack-project/backend`

### 3. Configurar variáveis de ambiente
No Railway dashboard, vá para Variables e adicione:

```env
DATABASE_URL=postgresql://postgres:password@hostname:port/database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
JWT_SECRET=your-secret-key
NODE_ENV=production
PORT=3001
```

### 4. Deploy automático
- O Railway fará deploy automático quando você fizer push
- URL da API: `https://seu-app.railway.app`

## Alternativa: Render (também gratuito)

1. Acesse: https://render.com/
2. Conecte GitHub
3. Crie "New Web Service"
4. Configure:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`

## Atualizar frontend para usar a API

Após o deploy, atualize o frontend para usar a URL da API:

```typescript
// No arquivo de configuração da API
const API_BASE_URL = 'https://seu-backend.railway.app';
```

## Comandos úteis

```bash
# Build local
npm run build

# Rodar produção local
npm run start:prod

# Ver logs no Railway
railway logs
```
