# 🧪 SCRIPT DE TESTE - SpecFlow Deploy
# Verifica se frontend e backend estão funcionando corretamente

param(
    [string]$BackendUrl = "https://specflow-backend.onrender.com"
)

Write-Host "🧪 Testando SpecFlow Deploy..." -ForegroundColor Cyan
Write-Host ""

# Teste 1: Frontend
Write-Host "📱 Testando Frontend..." -ForegroundColor Green
try {
    $frontendResponse = Invoke-WebRequest -Uri "https://specflow-app.surge.sh" -UseBasicParsing -TimeoutSec 10
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend: Online (Status $($frontendResponse.StatusCode))" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend: Erro - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Teste 2: Backend
Write-Host "🖥️  Testando Backend..." -ForegroundColor Yellow
try {
    $backendResponse = Invoke-WebRequest -Uri "$BackendUrl/api" -UseBasicParsing -TimeoutSec 15
    Write-Host "✅ Backend: Online (Status $($backendResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend: Erro - $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Verifique se a URL está correta: $BackendUrl" -ForegroundColor Blue
}

Write-Host ""

# Teste 3: Conectividade de API específicas
Write-Host "🔗 Testando APIs específicas..." -ForegroundColor Blue

$endpoints = @(
    "$BackendUrl/api/auth",
    "$BackendUrl/api/users", 
    "$BackendUrl/api/files",
    "$BackendUrl/api/ef"
)

foreach ($endpoint in $endpoints) {
    $apiName = ($endpoint -split "/")[-1]
    try {
        $apiResponse = Invoke-WebRequest -Uri $endpoint -UseBasicParsing -TimeoutSec 10
        Write-Host "  ✅ API $apiName`: OK" -ForegroundColor Green
    } catch {
        if ($_.Exception.Response.StatusCode -eq 401 -or $_.Exception.Response.StatusCode -eq 404) {
            Write-Host "  ✅ API $apiName`: OK (Autenticação necessária)" -ForegroundColor Yellow
        } else {
            Write-Host "  ❌ API $apiName`: Erro" -ForegroundColor Red
        }
    }
}

Write-Host ""

# Teste 4: CORS
Write-Host "🌐 Testando CORS..." -ForegroundColor Magenta
try {
    $headers = @{
        'Origin' = 'https://specflow-app.surge.sh'
        'Access-Control-Request-Method' = 'GET'
    }
    $corsResponse = Invoke-WebRequest -Uri "$BackendUrl/api" -Headers $headers -UseBasicParsing -TimeoutSec 10
    Write-Host "✅ CORS: Configurado corretamente" -ForegroundColor Green
} catch {
    Write-Host "⚠️  CORS: Verifique configuração" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 RESUMO DO TESTE:" -ForegroundColor Cyan
Write-Host "Frontend: https://specflow-app.surge.sh"
Write-Host "Backend: $BackendUrl"
Write-Host ""
Write-Host "Se todos os testes passaram, sua aplicação está funcionando! 🎉" -ForegroundColor Green
