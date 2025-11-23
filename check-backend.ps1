Write-Host "Verificando estado del backend..." -ForegroundColor Cyan

# Verificar puerto 4000
Write-Host "`n1. Verificando puerto 4000..." -ForegroundColor Yellow
$port4000 = netstat -ano | findstr :4000
if ($port4000) {
    Write-Host "[OK] Puerto 4000 esta en uso" -ForegroundColor Green
    Write-Host $port4000
} else {
    Write-Host "[ERROR] Puerto 4000 NO esta en uso" -ForegroundColor Red
}

# Verificar procesos Node
Write-Host "`n2. Verificando procesos Node.js..." -ForegroundColor Yellow
$nodeProcesses = Get-Process | Where-Object {$_.ProcessName -eq "node"}
if ($nodeProcesses) {
    Write-Host "[OK] Procesos Node.js encontrados:" -ForegroundColor Green
    $nodeProcesses | Format-Table ProcessName, Id, StartTime -AutoSize
} else {
    Write-Host "[ERROR] No hay procesos Node.js corriendo" -ForegroundColor Red
}

# Verificar respuesta del backend
Write-Host "`n3. Verificando respuesta del backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "[OK] Backend responde correctamente (Status: $($response.StatusCode))" -ForegroundColor Green
    Write-Host "   Contenido: $($response.Content.Substring(0, [Math]::Min(100, $response.Content.Length)))..." -ForegroundColor Gray
} catch {
    Write-Host "[ERROR] Backend NO responde: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar API de paquetes
Write-Host "`n4. Verificando API de paquetes..." -ForegroundColor Yellow
try {
    $paquetesResponse = Invoke-WebRequest -Uri "http://localhost:4000/api/paquete" -Method GET -UseBasicParsing -TimeoutSec 5
    $paquetes = $paquetesResponse.Content | ConvertFrom-Json
    Write-Host "[OK] API de paquetes responde correctamente" -ForegroundColor Green
    Write-Host "   Total de paquetes: $($paquetes.Count)" -ForegroundColor Gray
} catch {
    Write-Host "[ERROR] API de paquetes NO responde: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nVerificacion completada" -ForegroundColor Cyan

