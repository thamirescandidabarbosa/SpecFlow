# 🚀 SpecFlow - Deploy Completo na Nuvem

## ✅ STATUS ATUAL

- **Frontend**: ✅ Online em https://specflow-app.surge.sh
- **Backend**: ⚠️ Configurado para deploy (aguardando Render)
- **Database**: ⚠️ Configurado para Supabase (aguardando credenciais)

---

## 🎯 IMPLEMENTAÇÃO DOS 3 PASSOS

### 1. 🌐 Deploy do Backend (Render)

**📋 Passo a Passo Detalhado:**

1. **Acesse https://render.com**
   - Faça login com GitHub

2. **Criar Web Service:**
   - New + → Web Service
   - Connect GitHub → Repositório `SpecFlow`

3. **Configurações:**
   ```
   Name: specflow-backend
   Region: Oregon (US West)
   Branch: master
   Root Directory: fullstack-project/backend
   Runtime: Node
   Build Command: npm install && npm run build && npx prisma generate
   Start Command: npm run start:prod
   ```

4. **Environment Variables:**
   ```env
   DATABASE_URL=file:./prod.db
   JWT_SECRET=specflow-super-secret-jwt-key-2025
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   PORT=10000
   CORS_ORIGIN=https://specflow-app.surge.sh
   ```

5. **Deploy:**
   - Create Web Service
   - Aguarde build (3-5 min)
   - **Anote a URL**: https://specflow-backend-XXXX.onrender.com

---

### 2. 🔄 Atualizar Frontend

**Após o backend estar online:**

1. **Edite:** `frontend/.env.production`
   ```env
   REACT_APP_API_URL=https://SUA-URL-DO-BACKEND.onrender.com/api
   ```

2. **Redeploy:**
   ```bash
   cd frontend
   npm run deploy
   ```

   **Ou use o script automatizado:**
   ```bash
   .\deploy-frontend.ps1
   ```

---

### 3. 🗄️ Configurar Supabase

**📋 Configuração Completa:**

1. **Criar Projeto:**
   - https://supabase.com → New Project
   - Nome: `specflow-database`
   - Região: South America (se disponível)
   - **Anote a senha!**

2. **Obter Credenciais:**
   - Settings → API
   - Copie: Project URL, API Key, Database URL

3. **Atualizar Backend no Render:**
   ```env
   DATABASE_URL=postgresql://postgres:[SENHA]@db.[ID].supabase.co:5432/postgres
   SUPABASE_URL=https://[ID].supabase.co
   SUPABASE_ANON_KEY=eyJhbGc...
   ```

4. **Executar Migrações:**
   ```bash
   npx prisma db push
   ```

---

## 📁 ARQUIVOS CRIADOS

- `DEPLOY-GUIDE.md` - Guia detalhado de deploy
- `SUPABASE-CONFIG.md` - Configuração do Supabase
- `backend/.env.production` - Variáveis de produção
- `frontend/.env.production` - API URL de produção
- `deploy-frontend.ps1` - Script automatizado de deploy
- `Dockerfile` - Container para deploy

---

## 🔗 URLs FINAIS

Após completar todos os passos:

- **🌐 Frontend**: https://specflow-app.surge.sh
- **⚙️ Backend**: https://[SEU-BACKEND].onrender.com
- **🗄️ Database**: Supabase PostgreSQL
- **📊 Admin**: https://[SEU-PROJETO].supabase.co

---

## ⏱️ TEMPO ESTIMADO

- **Deploy Backend**: 5-10 minutos
- **Atualizar Frontend**: 2-3 minutos  
- **Configurar Supabase**: 10-15 minutos
- **Total**: 20-30 minutos

---

## 🆘 SUPORTE

Se encontrar problemas:

1. **Logs do Render**: Dashboard → seu-servico → Logs
2. **Teste APIs**: https://SEU-BACKEND.onrender.com/api
3. **Verifique CORS**: Frontend deve estar em `specflow-app.surge.sh`
4. **Database**: Execute `npx prisma db push` após mudanças

---

## 🎉 DEPOIS DO DEPLOY

Sua aplicação estará **100% funcional** na nuvem:

- ✅ Frontend React no Surge
- ✅ Backend NestJS no Render  
- ✅ Database PostgreSQL no Supabase
- ✅ Autenticação JWT
- ✅ Upload de arquivos
- ✅ Geração de PDFs
- ✅ Sistema de EF completo

**Pronto para produção!** 🚀
