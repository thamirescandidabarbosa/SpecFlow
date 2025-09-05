# 🚀 SCRIPT AUTOMATIZADO - Deploy Render + Frontend Update

param(
    [string]$RenderUrl = ""
)

Write-Host "🚀 DEPLOY AUTOMATIZADO SPECFLOW" -ForegroundColor Cyan
Write-Host ""

if ($RenderUrl -eq "") {
    Write-Host "📋 PASSO 1: DEPLOY NO RENDER" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "👉 Acesse: https://render.com" -ForegroundColor Blue
    Write-Host "🔧 Configure:"
    Write-Host "   Name: specflow-backend"
    Write-Host "   GitHub: SpecFlow repo"
    Write-Host "   Root: fullstack-project/backend"
    Write-Host "   Build: npm install && npm run build && npx prisma generate"
    Write-Host "   Start: npm run start:prod"
    Write-Host ""
    Write-Host "⚙️ Variables:"
    Write-Host "   CORS_ORIGIN=https://specflow-app.surge.sh"
    Write-Host "   NODE_ENV=production"
    Write-Host "   PORT=10000"
    Write-Host "   JWT_SECRET=specflow-super-secret-jwt-key-2025"
    Write-Host "   DATABASE_URL=file:./prod.db"
    Write-Host ""
    Write-Host "📝 Depois execute: .\auto-deploy.ps1 -RenderUrl 'https://sua-url.onrender.com'"
    return
}

Write-Host "📋 PASSO 2: ATUALIZANDO FRONTEND..." -ForegroundColor Green
Write-Host ""

# Atualizar .env.production
$envContent = "REACT_APP_API_URL=$RenderUrl/api"
Set-Content -Path "frontend\.env.production" -Value $envContent
Write-Host "✅ Atualizado frontend/.env.production" -ForegroundColor Green

# Navegar para frontend
Set-Location "frontend"

# Deploy
Write-Host "🚀 Fazendo deploy do frontend..." -ForegroundColor Yellow
npm run deploy

Write-Host ""
Write-Host "🎉 DEPLOY COMPLETO!" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 URLs:"
Write-Host "   Frontend: https://specflow-app.surge.sh"
Write-Host "   Backend: $RenderUrl"
Write-Host ""
Write-Host "🧪 TESTE:"
Write-Host "   Abra o frontend e tente fazer registro"
Write-Host "   Não deve haver erro CORS!"
