# 🗄️ CONFIGURAÇÃO SUPABASE - SpecFlow

## 📋 INSTRUÇÕES PASSO A PASSO

### 1. Criar Projeto no Supabase

1. **Acesse**: https://supabase.com
2. **Login**: Use sua conta GitHub ou email
3. **New Project**: Clique em "New Project"
4. **Configurações**:
   ```
   Organization: Sua organização
   Name: specflow-database
   Database Password: [CRIE UMA SENHA FORTE - ANOTE!]
   Region: South America (São Paulo) - se disponível
   Pricing Plan: Free (para começar)
   ```

### 2. Obter Credenciais

Após criar o projeto, vá em **Settings > API**:

```env
# Copie estas informações:
Project URL: https://[SEU-ID].supabase.co
Project API Key (anon): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Database URL: postgresql://postgres:[SUA-SENHA]@db.[SEU-ID].supabase.co:5432/postgres
```

### 3. Configurar Backend

**No Render Dashboard** ou **localmente no .env**:

```env
# Substitua pelos seus valores reais:
DATABASE_URL=postgresql://postgres:[SUA-SENHA]@db.[SEU-ID].supabase.co:5432/postgres
SUPABASE_URL=https://[SEU-ID].supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=production
JWT_SECRET=specflow-super-secret-jwt-key-2025
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://specflow-app.surge.sh
```

### 4. Executar Migrações

**Depois de configurar as variáveis, execute**:

```bash
# Localmente (com as novas variáveis):
cd fullstack-project/backend
npx prisma db push

# Ou no terminal do Render após deploy
```

### 5. Verificar Tabelas

No **Supabase Dashboard > Table Editor**, você deve ver:
- `User` - Usuários do sistema
- `FileUpload` - Arquivos enviados
- `FunctionalSpecification` - Especificações funcionais
- `FunctionalRequest` - Requisições de EF

---

## 🔧 TROUBLESHOOTING

### ❌ Connection Error:
```
Error: connect ENOTFOUND
```
**Solução**: Verifique se o `DATABASE_URL` está correto e a senha não tem caracteres especiais problemáticos.

### ❌ Authentication Failed:
```
Error: password authentication failed
```
**Solução**: Confirme a senha do banco. Resete se necessário em Settings > Database.

### ❌ Tables Not Found:
```
Error: Table 'User' doesn't exist
```
**Solução**: Execute `npx prisma db push` para criar as tabelas.

---

## 📱 EXEMPLO DE .env COMPLETO

```env
# === BANCO DE DADOS ===
DATABASE_URL="postgresql://postgres:SUA_SENHA_AQUI@db.abcdefghijk.supabase.co:5432/postgres"

# === SUPABASE ===
SUPABASE_URL="https://abcdefghijk.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQwNjI4NjYsImV4cCI6MjAwOTYzODg2Nn0.EXEMPLO_TOKEN_AQUI"

# === APLICAÇÃO ===
NODE_ENV="production"
PORT="10000"
JWT_SECRET="specflow-super-secret-jwt-key-2025"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="https://specflow-app.surge.sh"
```

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Crie projeto Supabase
2. ✅ Copie credenciais
3. ✅ Configure variáveis no Render
4. ✅ Execute migrações
5. ✅ Teste conexão
6. ✅ Verifique tabelas criadas

**Tempo estimado: 10-15 minutos** ⏱️
