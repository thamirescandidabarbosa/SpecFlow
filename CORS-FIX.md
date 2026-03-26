# Correcao de CORS - Render

## Problema

Se o frontend em `https://thamirescandidabarbosa.github.io/SpecFlow` nao conseguir falar com o backend, normalmente falta alinhar `CORS_ORIGIN` no Render.

## Configuracao correta

No painel do Render, configure:

```env
CORS_ORIGIN=https://thamirescandidabarbosa.github.io
FRONTEND_URL=https://thamirescandidabarbosa.github.io/SpecFlow
NODE_ENV=production
PORT=10000
```

## Teste rapido

Depois do redeploy, teste:

```powershell
Invoke-WebRequest -UseBasicParsing https://specflow.onrender.com/api/health
```

Resposta esperada:

```json
{"status":"ok"}
```

## Observacao

O backend atual usa Render como unica referencia de producao. Railway nao faz mais parte do fluxo oficial.
