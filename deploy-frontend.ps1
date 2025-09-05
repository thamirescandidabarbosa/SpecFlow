# 🚀 SCRIPT DE DEPLOY AUTOMÁTICO - SpecFlow (PowerShell)
# Execute este script após configurar o backend no Render

Write-Host "🚀 Iniciando deploy do frontend com nova API..." -ForegroundColor Cyan
Write-Host ""

# Navegar para o frontend
Set-Location -Path "frontend"

# Verificar se existe .env.production
if (-not (Test-Path ".env.production")) {
    Write-Host "❌ Arquivo .env.production não encontrado!" -ForegroundColor Red
    Write-Host "Crie o arquivo com:" -ForegroundColor Yellow
    Write-Host "REACT_APP_API_URL=https://SEU-BACKEND.onrender.com/api" -ForegroundColor White
    exit 1
}

Write-Host "✅ Arquivo .env.production encontrado" -ForegroundColor Green
Write-Host "📄 Conteúdo:" -ForegroundColor Blue
Get-Content ".env.production"
Write-Host ""

# Fazer deploy
Write-Host "🔄 Fazendo deploy no Surge..." -ForegroundColor Yellow
npm run deploy

Write-Host ""
Write-Host "✅ Deploy concluído!" -ForegroundColor Green
Write-Host "🌐 Frontend: https://specflow-app.surge.sh" -ForegroundColor Cyan
Write-Host "🔗 Teste a conexão entre frontend e backend" -ForegroundColor Blue
Write-Host ""
Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor Magenta
Write-Host "1. Verifique se o backend está online no Render" -ForegroundColor White
Write-Host "2. Teste APIs no browser: https://SEU-BACKEND.onrender.com/api" -ForegroundColor White
Write-Host "3. Configure Supabase conforme SUPABASE-CONFIG.md" -ForegroundColor White
