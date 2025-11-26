# Script para iniciar Backend y Frontend de Vola Barato
# Ejecutar desde PowerShell: .\iniciar-servidores.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando Servidores Vola Barato" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Rutas de los proyectos
$backendPath = "C:\Users\Administrator\Desktop\volabarato_backend\backup_volabarato"
$frontendPath = "C:\Users\Administrator\Desktop\volabarato_frontend"

# Verificar si existe el archivo .env en el backend
$envFile = Join-Path $backendPath ".env"
if (-not (Test-Path $envFile)) {
    Write-Host "⚠️  ADVERTENCIA: No se encontró el archivo .env en el backend" -ForegroundColor Yellow
    Write-Host "   El backend necesita las siguientes variables:" -ForegroundColor Yellow
    Write-Host "   - MONGO_URI (cadena de conexión a MongoDB)" -ForegroundColor Yellow
    Write-Host "   - JWT_SECRET (clave secreta para JWT)" -ForegroundColor Yellow
    Write-Host "   - PORT (puerto del servidor, por defecto 4000)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Puedes copiar env.example a .env y configurarlo:" -ForegroundColor Yellow
    Write-Host "   Copy-Item '$backendPath\env.example' '$envFile'" -ForegroundColor Gray
    Write-Host ""
    $continue = Read-Host "¿Deseas continuar de todos modos? (s/n)"
    if ($continue -ne "s" -and $continue -ne "S") {
        Write-Host "Operación cancelada." -ForegroundColor Red
        exit
    }
}

# Verificar que las dependencias estén instaladas
Write-Host "Verificando dependencias del Backend..." -ForegroundColor Cyan
if (-not (Test-Path (Join-Path $backendPath "node_modules"))) {
    Write-Host "⚠️  node_modules no encontrado en el backend. Ejecutando npm install..." -ForegroundColor Yellow
    Set-Location $backendPath
    npm install
}

Write-Host "Verificando dependencias del Frontend..." -ForegroundColor Cyan
if (-not (Test-Path (Join-Path $frontendPath "node_modules"))) {
    Write-Host "⚠️  node_modules no encontrado en el frontend. Ejecutando npm install..." -ForegroundColor Yellow
    Set-Location $frontendPath
    npm install
}

Write-Host ""
Write-Host "Iniciando servidores..." -ForegroundColor Green
Write-Host ""

# Iniciar Backend en una nueva ventana
Write-Host "🚀 Iniciando Backend en puerto 4000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Backend Vola Barato' -ForegroundColor Cyan; Write-Host 'Puerto: 4000' -ForegroundColor Green; Write-Host ''; npm run dev"

# Esperar un poco antes de iniciar el frontend
Start-Sleep -Seconds 3

# Iniciar Frontend en una nueva ventana
Write-Host "🚀 Iniciando Frontend en puerto 5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'Frontend Vola Barato' -ForegroundColor Cyan; Write-Host 'Puerto: 5173' -ForegroundColor Green; Write-Host ''; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Servidores iniciados" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Backend:  http://localhost:4000" -ForegroundColor Yellow
Write-Host "📍 Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "Los servidores se han abierto en ventanas separadas." -ForegroundColor Gray
Write-Host "Presiona Ctrl+C en cada ventana para detener los servidores." -ForegroundColor Gray
Write-Host ""

