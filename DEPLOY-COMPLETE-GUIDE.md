# 🚀 Deploy Guide - SpecFlow Full Stack

## ✅ Frontend - GitHub Pages
**URL:** https://thamirescandidabarbosa.github.io/SpecFlow/

### Comandos:
```bash
cd fullstack-project/frontend
npm run deploy  # Deploy automático
```

## 🔄 Backend - RENDER

### 1. Setup Render
1. Acesse: https://render.com/
2. Conecte GitHub
3. New Project → Deploy from GitHub
4. Selecione o repositório `SpecFlow`
5. Root Directory: `backend`

### 2. Variáveis de Ambiente (Render)
```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
SUPABASE_URL=https://your-project.supabase.co  
SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://thamirescandidabarbosa.github.io/SpecFlow
CORS_ORIGIN=https://thamirescandidabarbosa.github.io
NODE_ENV=production
PORT=10000
```

### 3. Após deploy do backend:
1. Copie a URL do Render (ex: `https://specflow.onrender.com`)
2. Atualize no frontend:

```typescript
// frontend/.env.production
REACT_APP_API_URL=https://specflow.onrender.com/api
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
Frontend (GitHub Pages)   Backend (Render)          Database (Supabase)
┌─────────────────┐       ┌──────────────────┐      ┌─────────────────┐
│ React App       │────→  │ NestJS API       │────→ │ PostgreSQL      │
│ github.io       │       │ .onrender.com    │      │ + Storage       │
│ /SpecFlow       │       │ specflow         │      │ .supabase.co    │
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

- **Frontend:** https://thamirescandidabarbosa.github.io/SpecFlow/
- **Backend:** https://specflow.onrender.com
- **Database:** https://[seu-projeto].supabase.co

---
**✅ Frontend já está online!**
**🔄 Backend aguardando configuração do Railway**
