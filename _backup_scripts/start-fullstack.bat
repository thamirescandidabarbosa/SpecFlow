@echo off
echo ===========================================
echo   INICIANDO FULLSTACK PROJECT
echo ===========================================

echo.
echo ✅ Iniciando Backend NestJS...
start "Backend Server - NestJS" cmd /k "cd /d %~dp0backend && npm run start:dev"

echo.
echo ⏳ Aguardando 3 segundos...
timeout /t 3 /nobreak >nul

echo.
echo ✅ Iniciando Frontend React...
start "Frontend Server - React" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ===========================================
echo   SERVIDORES INICIADOS COM SUCESSO!
echo ===========================================
echo.
echo 🌐 Backend:  http://localhost:3000/api
echo 🌐 Frontend: http://localhost:3001
echo.
echo 💡 Duas janelas do terminal foram abertas:
echo    - Backend Server - NestJS
echo    - Frontend Server - React
echo.
echo Para parar os servidores, feche as janelas ou use Ctrl+C
echo.
pause
