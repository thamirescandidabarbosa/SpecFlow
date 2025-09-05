#!/bin/bash

# 🚀 SCRIPT DE DEPLOY AUTOMÁTICO - SpecFlow
# Execute este script após configurar o backend no Render

echo "🚀 Iniciando deploy do frontend com nova API..."
echo ""

# Navegar para o frontend
cd frontend

# Verificar se existe .env.production
if [ ! -f ".env.production" ]; then
    echo "❌ Arquivo .env.production não encontrado!"
    echo "Crie o arquivo com:"
    echo "REACT_APP_API_URL=https://SEU-BACKEND.onrender.com/api"
    exit 1
fi

echo "✅ Arquivo .env.production encontrado"
echo "📄 Conteúdo:"
cat .env.production
echo ""

# Fazer deploy
echo "🔄 Fazendo deploy no Surge..."
npm run deploy

echo ""
echo "✅ Deploy concluído!"
echo "🌐 Frontend: https://specflow-app.surge.sh"
echo "🔗 Teste a conexão entre frontend e backend"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. Verifique se o backend está online no Render"
echo "2. Teste APIs no browser: https://SEU-BACKEND.onrender.com/api"
echo "3. Configure Supabase conforme SUPABASE-CONFIG.md"
