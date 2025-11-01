# Script de pruebas completo para el backend VolaBarato
Write-Host "=== INICIANDO PRUEBAS COMPLETAS DEL BACKEND ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:4000"
$authToken = $null
$testResults = @()

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
        Write-Host " $Name - Status: OK" -ForegroundColor Green
        
        if ($response.token) {
            $script:authToken = $response.token
            Write-Host "   Token almacenado" -ForegroundColor Gray
        }
        
        return @{ Success = $true; Response = $response }
    } catch {
        $errorMsg = $_.Exception.Message
        Write-Host " $Name - Error: $errorMsg" -ForegroundColor Red
        
        # Intentar obtener detalles del error
        if ($_.Exception.Response) {
            try {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $responseBody = $reader.ReadToEnd()
                $reader.Close()
                $errorDetails = $responseBody | ConvertFrom-Json -ErrorAction SilentlyContinue
                if ($errorDetails) {
                    Write-Host "   Detalles: $($errorDetails.error)" -ForegroundColor Yellow
                    if ($errorDetails.details) {
                        Write-Host "   Validacin: $($errorDetails.details)" -ForegroundColor Yellow
                    }
                }
            } catch {}
        }
        
        return @{ Success = $false; Error = $errorMsg }
    }
}

# 1. Probar endpoint principal
Write-Host "1. PROBANDO ENDPOINT PRINCIPAL" -ForegroundColor Yellow
$result = Test-Endpoint -Name "GET /" -Method "GET" -Url "$baseUrl/"
$testResults += $result

# 2. Probar endpoints pblicos GET
Write-Host "`n2. PROBANDO ENDPOINTS PBLICOS (GET)" -ForegroundColor Yellow
$endpoints = @(
    @{ Name = "GET /api/paquete"; Url = "$baseUrl/api/paquete" },
    @{ Name = "GET /api/producto"; Url = "$baseUrl/api/producto" },
    @{ Name = "GET /api/destino"; Url = "$baseUrl/api/destino" },
    @{ Name = "GET /api/reserva"; Url = "$baseUrl/api/reserva" }
)

foreach ($ep in $endpoints) {
    $result = Test-Endpoint -Name $ep.Name -Method "GET" -Url $ep.Url
    $testResults += $result
}

# 3. Probar registro de usuario
Write-Host "`n3. PROBANDO REGISTRO DE USUARIO" -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$registerData = @{
    usuario = "testuser_$timestamp"
    password = "test123456"
}
$result = Test-Endpoint -Name "POST /api/user/register" -Method "POST" -Url "$baseUrl/api/user/register" -Body $registerData

if (-not $result.Success) {
    # Si el usuario ya existe, intentar con el usuario fernanda
    Write-Host "`n   Intentando login con usuario 'fernanda'..." -ForegroundColor Gray
}

# 4. Probar login
Write-Host "`n4. PROBANDO LOGIN DE USUARIO" -ForegroundColor Yellow
$loginData = @{
    usuario = "fernanda"
    password = "123456.a"
}
$result = Test-Endpoint -Name "POST /api/user/login" -Method "POST" -Url "$baseUrl/api/user/login" -Body $loginData
$testResults += $result

if (-not $authToken) {
    Write-Host " No se pudo obtener token. Saltando pruebas que requieren autenticacin" -ForegroundColor Yellow
    exit
}

$headers = @{ Authorization = "Bearer $authToken" }

# 5. Probar GET /api/user/me
Write-Host "`n5. PROBANDO GET /api/user/me" -ForegroundColor Yellow
$result = Test-Endpoint -Name "GET /api/user/me" -Method "GET" -Url "$baseUrl/api/user/me" -Headers $headers
$userId = if ($result.Success) { $result.Response.user._id } else { $null }
$testResults += $result

# 6. Crear recursos para pruebas
Write-Host "`n6. CREANDO RECURSOS PARA PRUEBAS" -ForegroundColor Yellow

# Crear paquete
$paqueteData = @{
    nombre = "Paquete de Prueba $(Get-Date -Format 'HHmmss')"
    destino = "Pars"
    fecha = (Get-Date).AddDays(30).ToString("yyyy-MM-ddTHH:mm:ss.000Z")
    precio = 1200
    descripcion = "Paquete de prueba creado por script"
}
$result = Test-Endpoint -Name "POST /api/paquete" -Method "POST" -Url "$baseUrl/api/paquete" -Headers $headers -Body $paqueteData
$paqueteId = if ($result.Success) { $result.Response.paquete._id } else { $null }
$testResults += $result

# Crear producto
$productoData = @{
    nombre = "Producto de Prueba $(Get-Date -Format 'HHmmss')"
    descripcion = "Esta es una descripcin detallada del producto de prueba con ms de 10 caracteres"
    precio = 500
    categoria = "Electrnica"
    stock = 10
}
$result = Test-Endpoint -Name "POST /api/producto" -Method "POST" -Url "$baseUrl/api/producto" -Headers $headers -Body $productoData
$productoId = if ($result.Success) { $result.Response.producto._id } else { $null }
$testResults += $result

# Crear destino
$destinoData = @{
    nombre = "Destino de Prueba $(Get-Date -Format 'HHmmss')"
    pais = "Espaa"
    ciudad = "Madrid"
    descripcion = "Una descripcin detallada del destino de prueba con ms de 10 caracteres"
    clima = "Templado"
    mejorEpoca = "Primavera"
    actividades = @("Turismo", "Gastronoma", "Cultura")
    coordenadas = @{
        latitud = 40.4168
        longitud = -3.7038
    }
}
$result = Test-Endpoint -Name "POST /api/destino" -Method "POST" -Url "$baseUrl/api/destino" -Headers $headers -Body $destinoData
$destinoId = if ($result.Success) { $result.Response.destino._id } else { $null }
$testResults += $result

# 7. Probar actualizaciones (PUT)
Write-Host "`n7. PROBANDO ACTUALIZACIONES (PUT)" -ForegroundColor Yellow

if ($paqueteId) {
    $updatePaquete = @{
        nombre = "Paquete Actualizado $(Get-Date -Format 'HHmmss')"
        precio = 1500
    }
    $result = Test-Endpoint -Name "PUT /api/paquete/:id" -Method "PUT" -Url "$baseUrl/api/paquete/$paqueteId" -Headers $headers -Body $updatePaquete
    $testResults += $result
}

if ($productoId) {
    $updateProducto = @{
        precio = 600
        stock = 15
    }
    $result = Test-Endpoint -Name "PUT /api/producto/:id" -Method "PUT" -Url "$baseUrl/api/producto/$productoId" -Headers $headers -Body $updateProducto
    $testResults += $result
}

# 8. Probar GET por ID
Write-Host "`n8. PROBANDO GET POR ID" -ForegroundColor Yellow

if ($paqueteId) {
    $result = Test-Endpoint -Name "GET /api/paquete/:id" -Method "GET" -Url "$baseUrl/api/paquete/$paqueteId"
    $testResults += $result
}

if ($productoId) {
    $result = Test-Endpoint -Name "GET /api/producto/:id" -Method "GET" -Url "$baseUrl/api/producto/$productoId"
    $testResults += $result
}

if ($destinoId) {
    $result = Test-Endpoint -Name "GET /api/destino/:id" -Method "GET" -Url "$baseUrl/api/destino/$destinoId"
    $testResults += $result
}

# 9. Probar creacin de reserva
Write-Host "`n9. PROBANDO CREACIN DE RESERVA" -ForegroundColor Yellow

if ($userId -and $paqueteId) {
    $reservaData = @{
        usuario = $userId
        paquete = $paqueteId
        fechaViaje = (Get-Date).AddDays(30).ToString("yyyy-MM-ddTHH:mm:ss.000Z")
        cantidadPersonas = 2
        precioTotal = 2400
        metodoPago = "tarjeta"
        datosContacto = @{
            nombre = "Test User"
            email = "test@example.com"
            telefono = "1234567890"
        }
    }
    $result = Test-Endpoint -Name "POST /api/reserva" -Method "POST" -Url "$baseUrl/api/reserva" -Headers $headers -Body $reservaData
    $reservaId = if ($result.Success) { $result.Response.reserva._id } else { $null }
    $testResults += $result
    
    # Probar GET reserva por ID
    if ($reservaId) {
        Write-Host "`n10. PROBANDO GET RESERVA POR ID" -ForegroundColor Yellow
        $result = Test-Endpoint -Name "GET /api/reserva/:id" -Method "GET" -Url "$baseUrl/api/reserva/$reservaId" -Headers $headers
        $testResults += $result
    }
}

# 11. Probar validaciones (datos invlidos)
Write-Host "`n11. PROBANDO VALIDACIONES (datos invlidos)" -ForegroundColor Yellow

# Intentar crear paquete con datos invlidos
$invalidPaquete = @{
    nombre = "A"  # Muy corto
    precio = -100  # Negativo
}
$result = Test-Endpoint -Name "POST /api/paquete (datos invlidos)" -Method "POST" -Url "$baseUrl/api/paquete" -Headers $headers -Body $invalidPaquete
$testResults += $result

# 12. Probar endpoint sin autenticacin
Write-Host "`n12. PROBANDO ENDPOINT PROTEGIDO SIN TOKEN" -ForegroundColor Yellow
$result = Test-Endpoint -Name "POST /api/paquete (sin token)" -Method "POST" -Url "$baseUrl/api/paquete" -Body $paqueteData
$testResults += $result

# Resumen final
Write-Host "`n=== RESUMEN DE PRUEBAS ===" -ForegroundColor Cyan
$successCount = ($testResults | Where-Object { $_.Success -eq $true }).Count
$failCount = ($testResults | Where-Object { $_.Success -eq $false }).Count
$total = $testResults.Count

Write-Host "Total de pruebas: $total" -ForegroundColor White
Write-Host " Exitosas: $successCount" -ForegroundColor Green
Write-Host " Fallidas: $failCount" -ForegroundColor Red
Write-Host "Porcentaje de exito: $([math]::Round(($successCount / $total) * 100, 2))%" -ForegroundColor Cyan

Write-Host ""
Write-Host "=== PRUEBAS COMPLETADAS ===" -ForegroundColor Cyan
