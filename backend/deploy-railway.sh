#!/bin/bash

# Script para automatizar deploy no Railway

echo "🚀 Configurando deploy do SpecFlow no Railway..."

# 1. Instalar Railway CLI (se não estiver instalado)
if ! command -v railway &> /dev/null; then
    echo "📦 Instalando Railway CLI..."
    npm install -g @railway/cli
fi

# 2. Fazer login no Railway
echo "🔐 Faça login no Railway..."
railway login

# 3. Criar novo projeto
echo "📂 Criando projeto no Railway..."
railway init

# 4. Configurar variáveis de ambiente
echo "⚙️ Configurando variáveis de ambiente..."
railway add DATABASE_URL="postgresql://postgres:password@localhost:5432/specflow"
railway add JWT_SECRET="specflow-super-secret-jwt-key-2025"
railway add JWT_EXPIRES_IN="7d"
railway add NODE_ENV="production"
railway add PORT="3001"
railway add CORS_ORIGIN="https://specflow-app.surge.sh"

# 5. Fazer deploy
echo "🚀 Fazendo deploy..."
railway up

echo "✅ Deploy concluído!"
echo "🌐 Acesse: railway domains para ver a URL do seu backend"
