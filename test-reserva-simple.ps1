# Prueba simple del endpoint de reservas
$ErrorActionPreference = "Stop"

Write-Host "=== PRUEBA SIMPLE DEL ENDPOINT ===" -ForegroundColor Cyan

# Login
$login = Invoke-RestMethod -Uri 'http://localhost:4000/api/user/login' -Method POST -Body (@{usuario='fernanda';password='123456.a'} | ConvertTo-Json) -ContentType 'application/json'
$token = $login.token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Obtener paquetes
$paquetes = Invoke-RestMethod -Uri 'http://localhost:4000/api/paquete' -Headers $headers

# Preparar body
$body = @{
    paquete = $paquetes[0]._id
    fechaViaje = (Get-Date).AddDays(30).ToString('yyyy-MM-dd')
    cantidadPersonas = 2
    precioTotal = [int]($paquetes[0].precio * 2)
    metodoPago = 'tarjeta'
    datosContacto = @{
        nombre = 'Test'
        email = 'test@test.com'
        telefono = '1234567890'
    }
}

Write-Host "`nEnviando request..." -ForegroundColor Yellow
$jsonBody = $body | ConvertTo-Json -Depth 3
Write-Host "Body:" -ForegroundColor Gray
Write-Host $jsonBody -ForegroundColor White

try {
    $response = Invoke-RestMethod -Uri 'http://localhost:4000/api/reserva' -Method POST -Headers $headers -Body $jsonBody
    Write-Host "`n✅✅✅ RESERVA CREADA EXITOSAMENTE ✅✅✅" -ForegroundColor Green
    Write-Host "`nDetalles:" -ForegroundColor Cyan
    Write-Host "  ID: $($response.reserva._id)" -ForegroundColor White
    Write-Host "  Número de reserva: " -NoNewline
    if ($response.reserva.numeroReserva) {
        Write-Host "$($response.reserva.numeroReserva)" -ForegroundColor Green
    } else {
        Write-Host "NO GENERADO" -ForegroundColor Red
    }
    Write-Host "  Usuario: " -NoNewline
    if ($response.reserva.usuario) {
        Write-Host "$($response.reserva.usuario)" -ForegroundColor Green
    } else {
        Write-Host "NO ASIGNADO" -ForegroundColor Red
    }
    Write-Host "  Estado: $($response.reserva.estado)" -ForegroundColor White
} catch {
    Write-Host "`n❌ ERROR AL CREAR RESERVA" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
    
    if ($_.Exception.Response) {
        try {
            $responseStream = $_.Exception.Response.GetResponseStream()
            $streamReader = New-Object System.IO.StreamReader($responseStream)
            $errorBody = $streamReader.ReadToEnd()
            $streamReader.Close()
            $responseStream.Close()
            
            Write-Host "`nRespuesta del servidor:" -ForegroundColor Yellow
            Write-Host $errorBody -ForegroundColor White
            
            $errorJson = $errorBody | ConvertFrom-Json -ErrorAction SilentlyContinue
            if ($errorJson) {
                Write-Host "`nError parseado:" -ForegroundColor Yellow
                Write-Host "  Error: $($errorJson.error)" -ForegroundColor Red
                if ($errorJson.details) {
                    Write-Host "  Detalles: $($errorJson.details)" -ForegroundColor Yellow
                }
                if ($errorJson.message) {
                    Write-Host "  Mensaje: $($errorJson.message)" -ForegroundColor Yellow
                }
            }
        } catch {
            Write-Host "No se pudo leer el error del servidor: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
}

