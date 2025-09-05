# 🚀 Deploy Guide - SpecFlow Full Stack

## ✅ Frontend - SURGE (Já configurado!)
**URL:** https://specflow-app.surge.sh

### Comandos:
```bash
cd fullstack-project/frontend
npm run deploy  # Deploy automático
```

## 🔄 Backend - RAILWAY (Recomendado)

### 1. Setup Railway
1. Acesse: https://railway.app/
2. Conecte GitHub
3. New Project → Deploy from GitHub
4. Selecione: `fullstack-project/backend`

### 2. Variáveis de Ambiente (Railway)
```env
DATABASE_URL=postgresql://...
SUPABASE_URL=https://your-project.supabase.co  
SUPABASE_ANON_KEY=your-key
JWT_SECRET=your-secret
NODE_ENV=production
PORT=3001
```

### 3. Após deploy do backend:
1. Copie a URL do Railway (ex: `https://specflow-backend.railway.app`)
2. Atualize no frontend:

```typescript
// frontend/.env.production
REACT_APP_API_URL=https://SUA-URL-RAILWAY.railway.app
```

3. Redeploy frontend:
```bash
npm run deploy
```

## 🗄️ Database - SUPABASE

### Setup:
1. https://supabase.com/ → Novo projeto
2. Settings → Database → Copie connection string
3. Settings → API → Copie URL e anon key

## 📁 Estrutura de Deploy

```
Frontend (Surge)          Backend (Railway)         Database (Supabase)
┌─────────────────┐       ┌──────────────────┐      ┌─────────────────┐
│ React App       │────→  │ NestJS API       │────→ │ PostgreSQL      │
│ specflow-app    │       │ Node.js Server   │      │ + Storage       │
│ .surge.sh       │       │ .railway.app     │      │ .supabase.co    │
└─────────────────┘       └──────────────────┘      └─────────────────┘
```

## 🔧 Scripts Configurados

### Frontend:
- `npm start` - Desenvolvimento  
- `npm run build` - Build produção
- `npm run deploy` - Deploy Surge

### Backend:
- `npm run start:dev` - Desenvolvimento
- `npm run build` - Build produção  
- `npm run start:prod` - Produção

## ✨ Próximos Passos

1. **Configure Supabase** (database + storage)
2. **Deploy backend no Railway**
3. **Atualize frontend com URL da API**
4. **Teste aplicação completa**

## 🌐 URLs Finais

- **Frontend:** https://specflow-app.surge.sh
- **Backend:** https://[seu-projeto].railway.app
- **Database:** https://[seu-projeto].supabase.co

---
**✅ Frontend já está online!**
**🔄 Backend aguardando configuração do Railway**
