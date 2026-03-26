# Backend SpecFlow - Deploy com Supabase

## Configuração do Supabase

### 1. Criar conta no Supabase
1. Acesse [https://supabase.com/](https://supabase.com/)
2. Crie uma conta gratuita
3. Crie um novo projeto

### 2. Configurar o banco de dados
1. No dashboard do Supabase, vá para Settings > Database
2. Copie a connection string (DATABASE_URL)
3. Cole no arquivo `.env`

### 3. Configurar as chaves da API
1. No dashboard, vá para Settings > API
2. Copie a `URL` e `anon public key`
3. Cole no arquivo `.env`:
```env
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
```

### 4. Configurar Storage
1. No dashboard, vá para Storage
2. Crie um bucket chamado `uploads`
3. Configure as permissões conforme necessário

## Deploy no Render

### 1. Preparar o projeto
```bash
npm install
npm run build
```

### 2. Deploy
1. Acesse [https://render.com/](https://render.com/)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente no Render:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `FRONTEND_URL`
   - `CORS_ORIGIN`
   - `NODE_ENV=production`
   - `PORT=10000`

### 3. Executar migrações
```bash
npm run prisma:push
```

## Comandos úteis

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run start:dev

# Build
npm run build

# Produção
npm run start:prod

# Prisma
npm run prisma:generate
npm run prisma:push
npm run prisma:migrate

# Deploy
npm run db:deploy
```

## Estrutura de arquivos no Supabase Storage

```
uploads/
├── documents/
├── diagrams/
└── attachments/
```

## Variáveis de ambiente necessárias

```env
# Database
DATABASE_URL="postgresql://..."

# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"

# JWT
JWT_SECRET="your-secret"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV="production"
```
