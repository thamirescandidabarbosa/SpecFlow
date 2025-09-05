#!/bin/bash
# Railway build script

echo "🔧 Iniciando build..."

# Install dependencies
echo "📦 Instalando dependências..."
npm ci --only=production

# Generate Prisma client
echo "🗄️ Gerando Prisma client..."
npx prisma generate

# Build application
echo "🏗️ Building aplicação..."
npm run build

echo "✅ Build completo!"
