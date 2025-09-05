# 🚀 GUIA COMPLETO DE DEPLOY - SpecFlow

## 📋 CHECKLIST DE DEPLOY

### ✅ Já Concluído:
- [x] Frontend deployado no Surge: https://specflow-app.surge.sh
- [x] Backend configurado com Docker, Prisma e NestJS
- [x] Banco SQLite funcionando localmente
- [x] CORS configurado para aceitar Surge
- [x] Todas as APIs mapeadas e funcionais

### 🎯 PRÓXIMOS PASSOS:

---

## 1. 🌐 DEPLOY DO BACKEND (RENDER)

### Passo a Passo:

1. **Acesse https://render.com e faça login**

2. **Crie um novo Web Service:**
   - Clique em "New +" → "Web Service"
   - Conecte seu GitHub e selecione o repositório `SpecFlow`

3. **Configurações do Serviço:**
   ```
   Name: specflow-backend
   Region: Oregon (US West)
   Branch: master
   Root Directory: fullstack-project/backend
   Runtime: Node
   Build Command: npm install && npm run build && npx prisma generate
   Start Command: npm run start:prod
   ```

4. **Variáveis de Ambiente:**
   ```env
   DATABASE_URL=file:./prod.db
   JWT_SECRET=specflow-super-secret-jwt-key-2025
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   PORT=10000
   CORS_ORIGIN=https://specflow-app.surge.sh
   ```

5. **Deploy:**
   - Clique em "Create Web Service"
   - Aguarde o build (3-5 minutos)
   - Anote a URL gerada (ex: https://specflow-backend.onrender.com)

---

## 2. 🔄 ATUALIZAR FRONTEND

Após o backend estar online, atualize o frontend:

### Arquivo: `frontend/.env.production`
```env
REACT_APP_API_URL=https://SEU-BACKEND-URL.onrender.com/api
```

### Redeploy do Frontend:
```bash
cd frontend
npm run deploy
```

---

## 3. 🗄️ CONFIGURAR SUPABASE

### 3.1 Criar Projeto Supabase:
1. Acesse https://supabase.com
2. Crie novo projeto: "specflow-db"
3. Escolha região próxima
4. Defina senha forte para o banco

### 3.2 Obter Credenciais:
```
Project URL: https://xxx.supabase.co
API Key (anon): eyJhbGc...
Database URL: postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
```

### 3.3 Atualizar Backend no Render:
Adicione as variáveis no Render:
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
```

### 3.4 Executar Migrações:
No terminal do Render ou localmente:
```bash
npx prisma db push
```

---

## 🔗 URLs FINAIS

Após completar todos os passos:

- **Frontend**: https://specflow-app.surge.sh
- **Backend**: https://[SEU-BACKEND].onrender.com
- **Database**: Supabase PostgreSQL
- **Admin**: https://[SEU-PROJETO].supabase.co

---

## 🆘 TROUBLESHOOTING

### Problemas Comuns:

1. **Build Failed no Render:**
   - Verifique se todos os arquivos estão commitados
   - Confirme o Root Directory: `fullstack-project/backend`

2. **CORS Error:**
   - Verifique CORS_ORIGIN no backend
   - Deve ser exatamente: `https://specflow-app.surge.sh`

3. **Database Connection:**
   - Teste DATABASE_URL
   - Execute `npx prisma db push` após mudanças

4. **Frontend não conecta:**
   - Confirme REACT_APP_API_URL
   - Teste URLs no browser

---

## 📞 SUPORTE

Se precisar de ajuda:
1. Copie mensagens de erro completas
2. Verifique logs no Render Dashboard
3. Teste APIs individualmente
4. Confirme todas as variáveis de ambiente

**Tempo estimado total: 15-30 minutos** ⏱️
