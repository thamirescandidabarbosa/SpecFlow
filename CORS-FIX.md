# 🚨 CORREÇÃO URGENTE - CORS ERROR Railway

## ❌ PROBLEMA IDENTIFICADO

O backend no Railway está retornando:
```
Access-Control-Allow-Origin: https://railway.com
```

Mas deveria retornar:
```
Access-Control-Allow-Origin: https://specflow-app.surge.sh
```

## 🔧 SOLUÇÕES

### SOLUÇÃO 1: Configurar Variável CORS_ORIGIN no Railway

1. **Acesse Railway Dashboard**: https://railway.app
2. **Vá para seu projeto**: specflow-backend
3. **Settings → Variables**
4. **Adicione/Edite:**
   ```
   CORS_ORIGIN=https://specflow-app.surge.sh
   ```
5. **Redeploy**: Click em "Deploy"

### SOLUÇÃO 2: Verificar Todas as Variáveis

Confirme que estas variáveis estão configuradas:
```env
CORS_ORIGIN=https://specflow-app.surge.sh
NODE_ENV=production
PORT=3001
JWT_SECRET=specflow-super-secret-jwt-key-2025
JWT_EXPIRES_IN=7d
DATABASE_URL=file:./prod.db
```

### SOLUÇÃO 3: Force Redeploy

Se as variáveis estão corretas:
1. No Railway Dashboard
2. **Deployments → Latest**
3. **Three dots (⋯) → Redeploy**

## 🧪 TESTE RÁPIDO

Depois da correção, teste:
```bash
curl -H "Origin: https://specflow-app.surge.sh" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://specflow-backend.railway.app/api/auth/register
```

**Resposta esperada:**
```
Access-Control-Allow-Origin: https://specflow-app.surge.sh
```

## 🔄 CÓDIGO ATUALIZADO

Já atualizei `src/main.ts` com CORS mais robusto que:
- ✅ Lê `CORS_ORIGIN` da variável de ambiente
- ✅ Faz log da configuração
- ✅ Bloqueia origins não permitidas
- ✅ Inclui headers necessários

## ⏱️ TEMPO DE CORREÇÃO

- **Configure variável**: 1 minuto
- **Redeploy**: 3-5 minutos
- **Teste**: 1 minuto
- **Total**: ~5 minutos

## 🎯 PRÓXIMO PASSO

Após corrigir o CORS, o frontend conectará automaticamente com o backend! 🚀
