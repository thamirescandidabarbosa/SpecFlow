# 🚨 CORREÇÃO IMEDIATA - CORS Railway

## ❌ PROBLEMA CONFIRMADO

**Teste realizado:**
```
✅ CORS Headers recebidos:
  Access-Control-Allow-Origin: https://railway.com  ← ERRADO!
  Access-Control-Allow-Credentials: true
  Access-Control-Allow-Methods: GET,HEAD,PUT,POST,DELETE,PATCH
  Access-Control-Allow-Headers: Content-Type
```

**Deveria ser:**
```
Access-Control-Allow-Origin: https://specflow-app.surge.sh
```

## 🔧 SOLUÇÃO IMEDIATA

### 1. Configure a Variável CORS_ORIGIN

**No Railway Dashboard:**

1. **Acesse**: https://railway.app
2. **Login** e vá para o projeto `specflow-backend`
3. **Variables** (tab lateral)
4. **Add Variable**:
   ```
   Name: CORS_ORIGIN
   Value: https://specflow-app.surge.sh
   ```
5. **Add Variable**

### 2. Force Redeploy

1. **Deployments** (tab lateral)
2. **Latest deployment** → **Three dots (⋯)**
3. **Redeploy**
4. **Aguarde 3-5 minutos**

### 3. Teste Novamente

Execute este comando após o redeploy:
```powershell
$headers = @{ 'Origin' = 'https://specflow-app.surge.sh' }
Invoke-WebRequest -Uri "https://specflow-backend.railway.app/api" -Headers $headers -UseBasicParsing
```

**Resultado esperado:**
```
Access-Control-Allow-Origin: https://specflow-app.surge.sh
```

## 🎯 VERIFICAÇÃO RÁPIDA

Após corrigir, teste no browser:
1. Abra https://specflow-app.surge.sh
2. Tente fazer registro/login
3. Verifique se não há mais erros CORS

## ⚡ ALTERNATIVA RÁPIDA

Se não conseguir acessar o Railway, posso ajudar a fazer deploy no Render que é mais direto:
1. https://render.com
2. New Web Service
3. Connect GitHub
4. Variáveis já prontas no arquivo `.env.production`

**Tempo total para correção: 5 minutos** ⏱️
