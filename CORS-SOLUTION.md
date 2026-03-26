# Solucao de CORS - Render

## Passos

1. Abra `https://render.com`
2. Entre no servico `specflow`
3. Va em `Environment`
4. Confirme:

```env
CORS_ORIGIN=https://thamirescandidabarbosa.github.io
FRONTEND_URL=https://thamirescandidabarbosa.github.io/SpecFlow
```

5. Faça um redeploy

## Verificacao

```powershell
Invoke-WebRequest -UseBasicParsing https://specflow.onrender.com/api/health
```

Se isso responder `200`, o backend esta no ar e o proximo passo passa a ser apenas validar auth ou banco.
