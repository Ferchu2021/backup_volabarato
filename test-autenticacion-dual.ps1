# Script de prueba para autenticación dual
# Prueba los endpoints principales con Firebase Auth

$baseUrl = "https://backup-volabarato-1.onrender.com"
$firebaseApiKey = "AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A"

Write-Host "=== Prueba de Autenticación Dual ===" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Obtener token de Firebase
Write-Host "1. Obteniendo token de Firebase..." -ForegroundColor Yellow
$firebaseBody = @{
    email = "test@volabarato.com"
    password = "12345678"
    returnSecureToken = $true
} | ConvertTo-Json

try {
    $firebaseResponse = Invoke-RestMethod -Uri "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=$firebaseApiKey" `
        -Method Post `
        -Body $firebaseBody `
        -ContentType "application/json"
    
    $firebaseToken = $firebaseResponse.idToken
    Write-Host "✅ Token de Firebase obtenido: $($firebaseToken.Substring(0, 20))..." -ForegroundColor Green
} catch {
    Write-Host "❌ Error obteniendo token de Firebase: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Paso 2: Verificar perfil Firebase
Write-Host "2. Verificando perfil Firebase..." -ForegroundColor Yellow
try {
    $profileResponse = Invoke-RestMethod -Uri "$baseUrl/api/firebase/profile" `
        -Method Get `
        -Headers @{ "Authorization" = "Bearer $firebaseToken" }
    
    Write-Host "✅ Perfil Firebase OK" -ForegroundColor Green
    Write-Host "   UID: $($profileResponse.user.uid)" -ForegroundColor Gray
    Write-Host "   Email: $($profileResponse.user.email)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Error verificando perfil: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Paso 3: Obtener usuario vinculado
Write-Host "3. Obteniendo usuario vinculado..." -ForegroundColor Yellow
try {
    $userResponse = Invoke-RestMethod -Uri "$baseUrl/api/firebase/user" `
        -Method Get `
        -Headers @{ "Authorization" = "Bearer $firebaseToken" }
    
    Write-Host "✅ Usuario vinculado encontrado" -ForegroundColor Green
    Write-Host "   Usuario: $($userResponse.user.usuario)" -ForegroundColor Gray
    Write-Host "   Email: $($userResponse.user.email)" -ForegroundColor Gray
} catch {
    Write-Host "⚠️  Usuario no vinculado (esto es normal si es la primera vez)" -ForegroundColor Yellow
    Write-Host "   Usa /api/firebase/link-user para vincular" -ForegroundColor Gray
}

Write-Host ""

# Paso 4: Obtener mis reservas
Write-Host "4. Obteniendo mis reservas..." -ForegroundColor Yellow
try {
    $reservasResponse = Invoke-RestMethod -Uri "$baseUrl/api/reserva/mis-reservas" `
        -Method Get `
        -Headers @{ "Authorization" = "Bearer $firebaseToken" }
    
    Write-Host "✅ Mis reservas obtenidas" -ForegroundColor Green
    Write-Host "   Total: $($reservasResponse.pagination.total)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Error obteniendo reservas: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Paso 5: Obtener mis pagos
Write-Host "5. Obteniendo mis pagos..." -ForegroundColor Yellow
try {
    $pagosResponse = Invoke-RestMethod -Uri "$baseUrl/api/pago" `
        -Method Get `
        -Headers @{ "Authorization" = "Bearer $firebaseToken" }
    
    Write-Host "✅ Mis pagos obtenidos" -ForegroundColor Green
    Write-Host "   Total: $($pagosResponse.pagination.total)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Error obteniendo pagos: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Paso 6: Obtener usuario actual
Write-Host "6. Obteniendo usuario actual..." -ForegroundColor Yellow
try {
    $currentUserResponse = Invoke-RestMethod -Uri "$baseUrl/api/user/me" `
        -Method Get `
        -Headers @{ "Authorization" = "Bearer $firebaseToken" }
    
    Write-Host "✅ Usuario actual obtenido" -ForegroundColor Green
    Write-Host "   Usuario: $($currentUserResponse.usuario)" -ForegroundColor Gray
    Write-Host "   Email: $($currentUserResponse.email)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Error obteniendo usuario: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Pruebas Completadas ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Token de Firebase guardado para pruebas manuales:" -ForegroundColor Yellow
Write-Host "$firebaseToken" -ForegroundColor Gray

