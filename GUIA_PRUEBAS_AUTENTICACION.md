# 🧪 Guía de Pruebas - Autenticación Dual (JWT y Firebase)

## 📋 Checklist de Pruebas

### Prerequisitos

1. ✅ Backend compilado sin errores
2. ✅ Servidor corriendo (local o Render)
3. ✅ Usuario de prueba creado en Firebase: `test@volabarato.com`
4. ✅ Usuario de prueba creado en MongoDB (para JWT)
5. ✅ Postman configurado con colección

---

## 🔐 Prueba 1: Autenticación con Firebase

### Paso 1.1: Obtener Token de Firebase

**Request:**
```
POST https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "test@volabarato.com",
  "password": "12345678",
  "returnSecureToken": true
}
```

**Resultado esperado:** ✅ Debe retornar `idToken`

**Guarda el `idToken` para los siguientes pasos.**

---

### Paso 1.2: Verificar Perfil Firebase

**Request:**
```
GET https://backup-volabarato-1.onrender.com/api/firebase/profile
```

**Headers:**
```
Authorization: Bearer <idToken_de_paso_1.1>
```

**Resultado esperado:** ✅ Debe retornar información del usuario de Firebase

---

### Paso 1.3: Obtener Usuario Vinculado

**Request:**
```
GET https://backup-volabarato-1.onrender.com/api/firebase/user
```

**Headers:**
```
Authorization: Bearer <idToken_de_paso_1.1>
```

**Resultado esperado:** 
- Si el usuario está vinculado: ✅ Información del usuario de MongoDB
- Si no está vinculado: ⚠️ Error 404 (normal, usar `/api/firebase/link-user`)

---

## 📝 Prueba 2: Crear Reserva con Firebase Auth

### Paso 2.1: Crear Reserva

**Request:**
```
POST https://backup-volabarato-1.onrender.com/api/reserva
```

**Headers:**
```
Authorization: Bearer <idToken_de_paso_1.1>
Content-Type: application/json
```

**Body:**
```json
{
  "paquete": "<ID_de_un_paquete_existente>",
  "fechaViaje": "2025-12-15T00:00:00.000Z",
  "cantidadPersonas": 2,
  "precioTotal": 50000,
  "metodoPago": "tarjeta",
  "datosContacto": {
    "nombre": "Test User",
    "email": "test@volabarato.com",
    "telefono": "1234567890"
  }
}
```

**Resultado esperado:** ✅ Reserva creada exitosamente
- **IMPORTANTE:** No debe requerir `usuario` en el body
- El usuario se obtiene automáticamente del token

---

### Paso 2.2: Obtener Mis Reservas

**Request:**
```
GET https://backup-volabarato-1.onrender.com/api/reserva/mis-reservas
```

**Headers:**
```
Authorization: Bearer <idToken_de_paso_1.1>
```

**Resultado esperado:** ✅ Lista de reservas del usuario autenticado
- **IMPORTANTE:** No debe requerir `usuarioId` en query params

---

## 🔒 Prueba 3: Verificar Permisos de Reservas

### Paso 3.1: Intentar Actualizar Reserva de Otro Usuario

**Request:**
```
PUT https://backup-volabarato-1.onrender.com/api/reserva/<ID_de_reserva_de_otro_usuario>
```

**Headers:**
```
Authorization: Bearer <idToken_de_paso_1.1>
Content-Type: application/json
```

**Body:**
```json
{
  "cantidadPersonas": 3
}
```

**Resultado esperado:** ❌ Error 403 "Solo puedes actualizar tus propias reservas"

---

### Paso 3.2: Actualizar Mi Propia Reserva

**Request:**
```
PUT https://backup-volabarato-1.onrender.com/api/reserva/<ID_de_mi_reserva>
```

**Headers:**
```
Authorization: Bearer <idToken_de_paso_1.1>
Content-Type: application/json
```

**Body:**
```json
{
  "cantidadPersonas": 3
}
```

**Resultado esperado:** ✅ Reserva actualizada exitosamente

---

### Paso 3.3: Cancelar Mi Reserva

**Request:**
```
PUT https://backup-volabarato-1.onrender.com/api/reserva/<ID_de_mi_reserva>/cancelar
```

**Headers:**
```
Authorization: Bearer <idToken_de_paso_1.1>
```

**Resultado esperado:** ✅ Reserva cancelada exitosamente

---

## 💳 Prueba 4: Pagos con Firebase Auth

### Paso 4.1: Crear Pago para Mi Reserva

**Request:**
```
POST https://backup-volabarato-1.onrender.com/api/pago
```

**Headers:**
```
Authorization: Bearer <idToken_de_paso_1.1>
Content-Type: application/json
```

**Body:**
```json
{
  "reserva": "<ID_de_mi_reserva_confirmada>",
  "metodoPago": "tarjeta",
  "monto": 50000,
  "moneda": "ARS"
}
```

**Resultado esperado:** ✅ Pago creado exitosamente

---

### Paso 4.2: Obtener Mis Pagos

**Request:**
```
GET https://backup-volabarato-1.onrender.com/api/pago
```

**Headers:**
```
Authorization: Bearer <idToken_de_paso_1.1>
```

**Resultado esperado:** ✅ Solo pagos de mis reservas (no de otros usuarios)

---

### Paso 4.3: Intentar Crear Pago para Reserva de Otro Usuario

**Request:**
```
POST https://backup-volabarato-1.onrender.com/api/pago
```

**Headers:**
```
Authorization: Bearer <idToken_de_paso_1.1>
Content-Type: application/json
```

**Body:**
```json
{
  "reserva": "<ID_de_reserva_de_otro_usuario>",
  "metodoPago": "tarjeta",
  "monto": 50000
}
```

**Resultado esperado:** ❌ Error 403 "Solo puedes crear pagos para tus propias reservas"

---

## 👤 Prueba 5: Autenticación con JWT (Verificar Compatibilidad)

### Paso 5.1: Login con JWT

**Request:**
```
POST https://backup-volabarato-1.onrender.com/api/user/login
```

**Body:**
```json
{
  "usuario": "testuser",
  "password": "password123"
}
```

**Resultado esperado:** ✅ Token JWT retornado

**Guarda el token JWT para los siguientes pasos.**

---

### Paso 5.2: Crear Reserva con JWT

**Request:**
```
POST https://backup-volabarato-1.onrender.com/api/reserva
```

**Headers:**
```
Authorization: Bearer <token_JWT_de_paso_5.1>
Content-Type: application/json
```

**Body:**
```json
{
  "paquete": "<ID_de_un_paquete_existente>",
  "fechaViaje": "2025-12-20T00:00:00.000Z",
  "cantidadPersonas": 1,
  "precioTotal": 30000,
  "metodoPago": "transferencia",
  "datosContacto": {
    "nombre": "Test User JWT",
    "email": "testjwt@volabarato.com",
    "telefono": "1234567890"
  }
}
```

**Resultado esperado:** ✅ Reserva creada exitosamente con JWT

---

## 🔐 Prueba 6: Autenticación Dual (JWT o Firebase)

### Paso 6.1: Obtener Mis Reservas con JWT

**Request:**
```
GET https://backup-volabarato-1.onrender.com/api/reserva/mis-reservas
```

**Headers:**
```
Authorization: Bearer <token_JWT>
```

**Resultado esperado:** ✅ Lista de reservas del usuario (JWT funciona)

---

### Paso 6.2: Obtener Mis Reservas con Firebase

**Request:**
```
GET https://backup-volabarato-1.onrender.com/api/reserva/mis-reservas
```

**Headers:**
```
Authorization: Bearer <idToken_Firebase>
```

**Resultado esperado:** ✅ Lista de reservas del usuario (Firebase funciona)

---

## 👨‍💼 Prueba 7: Permisos de Administrador

### Paso 7.1: Confirmar Reserva (Solo Admin)

**Request:**
```
PUT https://backup-volabarato-1.onrender.com/api/reserva/<ID_de_reserva>/confirmar
```

**Headers:**
```
Authorization: Bearer <token_de_usuario_cliente>
```

**Resultado esperado:** ❌ Error 403 "Solo los administradores pueden confirmar reservas"

---

### Paso 7.2: Confirmar Reserva con Admin

**Request:**
```
PUT https://backup-volabarato-1.onrender.com/api/reserva/<ID_de_reserva>/confirmar
```

**Headers:**
```
Authorization: Bearer <token_de_usuario_admin>
```

**Resultado esperado:** ✅ Reserva confirmada exitosamente

---

## 🔗 Prueba 8: Vincular Usuario Firebase con MongoDB

### Paso 8.1: Vincular Usuario

**Request:**
```
POST https://backup-volabarato-1.onrender.com/api/firebase/link-user
```

**Headers:**
```
Authorization: Bearer <idToken_Firebase>
Content-Type: application/json
```

**Body:**
```json
{
  "email": "test@volabarato.com"
}
```

**Resultado esperado:** ✅ Usuario vinculado exitosamente

---

### Paso 8.2: Obtener Usuario Vinculado

**Request:**
```
GET https://backup-volabarato-1.onrender.com/api/firebase/user
```

**Headers:**
```
Authorization: Bearer <idToken_Firebase>
```

**Resultado esperado:** ✅ Información del usuario de MongoDB vinculado

---

## ✅ Resultados Esperados

### Si Todo Funciona Correctamente:

- ✅ Firebase Auth funciona en todos los endpoints
- ✅ JWT Auth funciona en todos los endpoints
- ✅ Los usuarios solo pueden modificar sus propios recursos
- ✅ Los administradores tienen permisos especiales
- ✅ No se requiere `usuarioId` en el body de las requests
- ✅ Los filtros funcionan correctamente (usuarios ven solo sus datos)

---

## ❌ Errores Comunes y Soluciones

### Error 401: "Usuario no encontrado"
- **Causa:** El usuario de Firebase no está vinculado con MongoDB
- **Solución:** Usar `/api/firebase/link-user` para vincular

### Error 403: "Acceso denegado"
- **Causa:** Intentando modificar recurso de otro usuario
- **Solución:** Verificar que estás usando el token correcto

### Error 400: "ID de usuario requerido"
- **Causa:** Endpoint antiguo que aún espera `usuarioId` en body
- **Solución:** Verificar que el endpoint esté actualizado

---

## 📝 Notas

- Los tokens de Firebase expiran después de 1 hora
- Los tokens JWT expiran después de 24 horas
- Si un token expira, obtener uno nuevo
- Los administradores pueden ver y modificar todos los recursos
- Los usuarios regulares solo pueden ver y modificar sus propios recursos

---

¿Listo para probar? Empieza con la Prueba 1 y avanza secuencialmente.

