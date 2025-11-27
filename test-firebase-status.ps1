# Script para probar el endpoint de Firebase
Write-Host "Probando endpoint de Firebase..." -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "https://backup-volabarato-1.onrender.com/api/firebase/status" -Method GET
    
    Write-Host "✅ Respuesta exitosa:" -ForegroundColor Green
    Write-Host ""
    $response | ConvertTo-Json -Depth 10
    
    if ($response.status -eq "configured") {
        Write-Host ""
        Write-Host "✅ Firebase está configurado correctamente!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "⚠️ Firebase no está configurado" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error al conectar:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host ""
        Write-Host "⚠️ El endpoint no existe. Verifica que el código se haya desplegado correctamente en Render." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Presiona cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

