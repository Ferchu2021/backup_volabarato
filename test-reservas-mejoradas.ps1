# Script de prueba para las mejoras de reservas
Write-Host "=== PRUEBA DE MEJORAS DE RESERVAS ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:4000"
$authToken = $null
$userId = $null
$paqueteId = $null
$reservaId = $null

# Función auxiliar para hacer peticiones
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [hashtable]$Headers = @{},
        [object]$Body = $null
    )
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            ErrorAction = "Stop"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 5)
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "✅ $Name" -ForegroundColor Green
        
        if ($response.token) {
            $script:authToken = $response.token
            Write-Host "   Token obtenido" -ForegroundColor Gray
        }
        
        return $response
    } catch {
        $errorMsg = $_.Exception.Message
        Write-Host "❌ $Name - Error: $errorMsg" -ForegroundColor Red
        
        if ($_.Exception.Response) {
            try {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $responseBody = $reader.ReadToEnd()
                $reader.Close()
                $errorDetails = $responseBody | ConvertFrom-Json -ErrorAction SilentlyContinue
                if ($errorDetails.error) {
                    Write-Host "   Detalle: $($errorDetails.error)" -ForegroundColor Yellow
                }
            } catch {}
        }
        
        return $null
    }
}

# Paso 1: Login
Write-Host "1. Autenticación..." -ForegroundColor Cyan
$loginResponse = Test-Endpoint -Name "Login" -Method "POST" -Url "$baseUrl/api/user/login" -Body @{
    usuario = "fernanda"
    password = "123456.a"
}

if (-not $loginResponse) {
    Write-Host "`n❌ No se pudo autenticar. Abortando pruebas." -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $authToken"
    "Content-Type" = "application/json"
}

# Paso 2: Obtener paquetes disponibles
Write-Host "`n2. Obteniendo paquetes disponibles..." -ForegroundColor Cyan
$paquetes = Test-Endpoint -Name "Obtener paquetes" -Method "GET" -Url "$baseUrl/api/paquete" -Headers $headers

if ($paquetes -and $paquetes.Count -gt 0) {
    $paqueteId = $paquetes[0]._id
    Write-Host "   Paquete seleccionado: $($paquetes[0].nombre) - ID: $paqueteId" -ForegroundColor Gray
} else {
    Write-Host "❌ No hay paquetes disponibles" -ForegroundColor Red
    exit 1
}

# Paso 3: Crear una nueva reserva (SIN incluir usuario en el body)
Write-Host "`n3. Creando nueva reserva (con número automático)..." -ForegroundColor Cyan
$fechaViaje = (Get-Date).AddDays(30).ToString("yyyy-MM-dd")
$reservaData = @{
    paquete = $paqueteId
    fechaViaje = $fechaViaje
    cantidadPersonas = 2
    precioTotal = $paquetes[0].precio * 2
    metodoPago = "tarjeta"
    observaciones = "Prueba de reserva mejorada"
    datosContacto = @{
        nombre = "Usuario Prueba"
        email = "prueba@test.com"
        telefono = "1234567890"
    }
}

Write-Host "   Datos enviados (SIN usuario en body):" -ForegroundColor Gray
$reservaData | ConvertTo-Json -Depth 3 | Write-Host

$reservaResponse = Test-Endpoint -Name "Crear reserva" -Method "POST" -Url "$baseUrl/api/reserva" -Headers $headers -Body $reservaData

if ($reservaResponse -and $reservaResponse.reserva) {
    $reserva = $reservaResponse.reserva
    $reservaId = $reserva._id
    
    Write-Host "`n✅ RESERVA CREADA EXITOSAMENTE" -ForegroundColor Green
    Write-Host "   ID de reserva: $reservaId" -ForegroundColor White
    
    # Verificar número de reserva
    if ($reserva.numeroReserva) {
        Write-Host "   ✅ Número de reserva generado: $($reserva.numeroReserva)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ No se generó número de reserva" -ForegroundColor Red
    }
    
    # Verificar usuario asignado
    if ($reserva.usuario) {
        Write-Host "   ✅ Usuario asignado automáticamente: $($reserva.usuario)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ No se asignó usuario" -ForegroundColor Red
    }
    
    Write-Host "`n   Detalles completos de la reserva:" -ForegroundColor Cyan
    $reserva | ConvertTo-Json -Depth 3 | Write-Host
} else {
    Write-Host "❌ No se pudo crear la reserva" -ForegroundColor Red
    exit 1
}

# Paso 4: Obtener mis reservas
Write-Host "`n4. Obteniendo mis reservas..." -ForegroundColor Cyan
$misReservas = Test-Endpoint -Name "Obtener mis reservas" -Method "GET" -Url "$baseUrl/api/reserva/mis-reservas" -Headers $headers

if ($misReservas -and $misReservas.reservas) {
    $totalReservas = $misReservas.reservas.Count
    Write-Host "   Total de reservas encontradas: $totalReservas" -ForegroundColor Gray
    
    $reservasConNumero = ($misReservas.reservas | Where-Object { $_.numeroReserva }).Count
    Write-Host "   Reservas con número: $reservasConNumero / $totalReservas" -ForegroundColor Gray
    
    if ($reservasConNumero -eq $totalReservas -and $totalReservas -gt 0) {
        Write-Host "   ✅ Todas las reservas tienen número asignado" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️ Algunas reservas no tienen número" -ForegroundColor Yellow
    }
    
    Write-Host "`n   Primeras 3 reservas:" -ForegroundColor Cyan
    $misReservas.reservas | Select-Object -First 3 | ForEach-Object {
        Write-Host "   - $($_.numeroReserva) | $($_.paquete.nombre) | $($_.estado)" -ForegroundColor White
    }
} else {
    Write-Host "   ⚠️ No se pudieron obtener las reservas" -ForegroundColor Yellow
}

# Paso 5: Obtener reserva por ID
if ($reservaId) {
    Write-Host "`n5. Obteniendo reserva por ID..." -ForegroundColor Cyan
    $reservaById = Test-Endpoint -Name "Obtener reserva por ID" -Method "GET" -Url "$baseUrl/api/reserva/$reservaId" -Headers $headers
    
    if ($reservaById -and $reservaById.numeroReserva) {
        Write-Host "   ✅ Reserva encontrada con número: $($reservaById.numeroReserva)" -ForegroundColor Green
    }
}

Write-Host "`n=== RESUMEN DE PRUEBAS ===" -ForegroundColor Cyan
Write-Host "✅ Autenticación: OK" -ForegroundColor Green
Write-Host "✅ Creación de reserva: OK" -ForegroundColor Green
Write-Host "✅ Número de reserva automático: " -NoNewline
if ($reservaResponse -and $reservaResponse.reserva.numeroReserva) {
    Write-Host "OK - $($reservaResponse.reserva.numeroReserva)" -ForegroundColor Green
} else {
    Write-Host "FALLO" -ForegroundColor Red
}
Write-Host "✅ Usuario asignado desde token: " -NoNewline
if ($reservaResponse -and $reservaResponse.reserva.usuario) {
    Write-Host "OK" -ForegroundColor Green
} else {
    Write-Host "FALLO" -ForegroundColor Red
}

