# Configuracao para Render

## Build Command

```bash
npm install --include=dev && npx prisma generate && npm run build
```

## Start Command

```bash
npm run start:prod
```

## Variaveis de ambiente

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

## Passos no Render

1. Acesse `https://render.com`
2. Crie um `Web Service`
3. Conecte o repositorio `SpecFlow`
4. Configure:
   - Name: `specflow-backend`
   - Root Directory: `backend`
   - Build Command: `npm install --include=dev && npx prisma generate && npm run build`
   - Start Command: `npm run start:prod`
5. Adicione as variaveis de ambiente
6. Faça o deploy
