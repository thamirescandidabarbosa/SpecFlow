# Configuração para Render

## 1. Build Command
```bash
npm install && npm run build && npx prisma generate && npx prisma db push
```

## 2. Start Command  
```bash
npm run start:prod
```

## 3. Variáveis de Ambiente
```env
DATABASE_URL=file:./prod.db
JWT_SECRET=specflow-super-secret-jwt-key-2025
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://specflow-app.surge.sh
```

## 4. Passos no Render:
1. Acesse https://render.com
2. New → Web Service
3. Connect GitHub → Selecione repositório SpecFlow
4. Configure:
   - Name: specflow-backend
   - Root Directory: fullstack-project/backend
   - Build Command: npm install && npm run build && npx prisma generate && npx prisma db push
   - Start Command: npm run start:prod
5. Add Environment Variables
6. Deploy!
