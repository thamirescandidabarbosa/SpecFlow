# Google Auth Setup

Para ativar o login com Google no SpecFlow, configure backend e frontend com as variaveis abaixo.

## Backend

Defina estas variaveis no ambiente do backend:

```env
FRONTEND_URL=https://thamirescandidabarbosa.github.io/SpecFlow
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_CLIENT_SECRET=seu-client-secret
GOOGLE_CALLBACK_URL=https://SEU-BACKEND/api/auth/google/callback
```

No Google Cloud Console:

1. Crie um OAuth Client ID do tipo Web Application.
2. Em `Authorized JavaScript origins`, adicione:
   `https://thamirescandidabarbosa.github.io`
3. Em `Authorized redirect URIs`, adicione:
   `https://SEU-BACKEND/api/auth/google/callback`

## Frontend

Ative o botao de Google no frontend:

```env
REACT_APP_ENABLE_GOOGLE_AUTH=true
```

O frontend redireciona para o backend em `/auth/google`, e o backend devolve o usuario autenticado para `/auth/callback`.

## Fluxo

1. Usuario clica em `Continuar com Google`.
2. Backend inicia OAuth com Google.
3. Google redireciona para o backend.
4. Backend cria ou reutiliza a conta local pelo email.
5. Backend devolve token JWT para o frontend.
