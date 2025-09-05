# 🚨 CORREÇÃO URGENTE - Railway CORS

## ⚠️ PROBLEMA ATUAL
```
❌ Backend retorna: Access-Control-Allow-Origin: https://railway.com  
✅ Precisa retornar: Access-Control-Allow-Origin: https://specflow-app.surge.sh
```

## 🔧 SOLUÇÃO PASSO A PASSO

### 1. Acesse Railway Dashboard
👉 **URL**: https://railway.app/dashboard

### 2. Selecione o Projeto
- Clique no projeto: **specflow-backend** ou **SpecFlow**

### 3. Configure Variável CORS_ORIGIN
1. **Clique em "Variables"** (menu lateral esquerdo)
2. **Clique em "New Variable"**
3. **Preencha**:
   ```
   Variable Name: CORS_ORIGIN
   Variable Value: https://specflow-app.surge.sh
   ```
4. **Clique "Add"**

### 4. Force Redeploy
1. **Vá para "Deployments"** (menu lateral)
2. **Clique nos 3 pontos (⋯)** do último deploy
3. **Clique "Redeploy"**
4. **Aguarde 3-5 minutos**

### 5. Verificação
Após o redeploy, teste:
```
https://specflow-app.surge.sh → Register/Login
```

## 🎯 VERIFICAÇÃO RÁPIDA

Execute este comando após a correção:
```powershell
$headers = @{ 'Origin' = 'https://specflow-app.surge.sh' }
Invoke-WebRequest -Uri "https://specflow-backend.railway.app/api" -Headers $headers
```

**Resultado esperado:**
```
Access-Control-Allow-Origin: https://specflow-app.surge.sh ✅
```

## 📱 TESTE NO FRONTEND

1. Abra: https://specflow-app.surge.sh
2. Clique em "Register" 
3. Preencha formulário
4. **Não deve haver erro CORS**

## ⏱️ CRONÔMETRO

- **Configurar variável**: 1 minuto
- **Redeploy**: 3-4 minutos  
- **Teste**: 30 segundos
- **Total**: ~5 minutos

---

## 🔄 ALTERNATIVA: Deploy no Render

Se não conseguir acessar Railway:

1. **Render.com** → New Web Service
2. **GitHub** → Repositório SpecFlow  
3. **Settings**:
   ```
   Root Directory: fullstack-project/backend
   Build Command: npm install && npm run build && npx prisma generate
   Start Command: npm run start:prod
   ```
4. **Variables**:
   ```
   CORS_ORIGIN=https://specflow-app.surge.sh
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=specflow-super-secret-jwt-key-2025
   DATABASE_URL=file:./prod.db
   ```

**Tempo Render**: ~8-10 minutos (primeira vez)

---

## 🎉 RESULTADO FINAL

Após a correção:
- ✅ Frontend: https://specflow-app.surge.sh  
- ✅ Backend: https://specflow-backend.railway.app
- ✅ **CORS funcionando**
- ✅ **App 100% online**
