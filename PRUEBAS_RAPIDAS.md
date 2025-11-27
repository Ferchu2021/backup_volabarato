# ⚡ Pruebas Rápidas - 4 Pasos

## 📋 Prerequisitos
- Postman instalado
- Usuario de prueba en Firebase: `test@volabarato.com` / `12345678`
- Al menos 1 paquete creado en la base de datos

---

## 🚀 Prueba 1: Obtener Token Firebase

### En Postman:

**1. Crear nueva request:**
- Método: `POST`
- URL: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A`

**2. Headers:**
```
Content-Type: application/json
```

**3. Body (raw JSON):**
```json
{
  "email": "test@volabarato.com",
  "password": "12345678",
  "returnSecureToken": true
}
```

**4. Enviar y copiar el `idToken` de la respuesta**

✅ **Resultado esperado:** Debe retornar `idToken` (copia este token para las siguientes pruebas)

---

## 📝 Prueba 2: Crear Reserva (SIN usuario en body)

### En Postman:

**1. Crear nueva request:**
- Método: `POST`
- URL: `https://backup-volabarato-1.onrender.com/api/reserva`

**2. Headers:**
```
Authorization: Bearer <PEGA_AQUI_EL_ID_TOKEN_DE_LA_PRUEBA_1>
Content-Type: application/json
```

**3. Body (raw JSON):**
```json
{
  "paquete": "<ID_DE_UN_PAQUETE_EXISTENTE>",
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

**⚠️ IMPORTANTE:** NO incluyas `"usuario": "..."` en el body

**4. Enviar**

✅ **Resultado esperado:** 
- Status: `201 Created`
- La reserva se crea exitosamente
- El `usuario` se asigna automáticamente desde el token

**💡 Si no tienes un ID de paquete:**
1. Primero haz: `GET https://backup-volabarato-1.onrender.com/api/paquete`
2. Copia el `_id` de cualquier paquete de la respuesta

---

## 📋 Prueba 3: Obtener Mis Reservas (SIN usuarioId en query)

### En Postman:

**1. Crear nueva request:**
- Método: `GET`
- URL: `https://backup-volabarato-1.onrender.com/api/reserva/mis-reservas`

**2. Headers:**
```
Authorization: Bearer <MISMO_ID_TOKEN_DE_LA_PRUEBA_1>
```

**3. Enviar**

✅ **Resultado esperado:**
- Status: `200 OK`
- Retorna solo las reservas del usuario autenticado
- No necesitas pasar `usuarioId` en query params

**⚠️ IMPORTANTE:** NO uses query params como `?usuarioId=...`

---

## 🔒 Prueba 4: Verificar Permisos (No puedo modificar recursos de otros)

### Paso 4.1: Intentar actualizar reserva de otro usuario

**1. Obtén el ID de una reserva que NO sea tuya:**
   - Si eres admin, puedes ver todas las reservas: `GET /api/reserva`
   - Copia el `_id` de una reserva de otro usuario

**2. Crear nueva request:**
- Método: `PUT`
- URL: `https://backup-volabarato-1.onrender.com/api/reserva/<ID_DE_RESERVA_DE_OTRO_USUARIO>`

**3. Headers:**
```
Authorization: Bearer <MISMO_ID_TOKEN_DE_LA_PRUEBA_1>
Content-Type: application/json
```

**4. Body (raw JSON):**
```json
{
  "cantidadPersonas": 999
}
```

**5. Enviar**

❌ **Resultado esperado:**
- Status: `403 Forbidden`
- Error: "Solo puedes actualizar tus propias reservas" o similar

---

### Paso 4.2: Actualizar MI propia reserva (debe funcionar)

**1. Crear nueva request:**
- Método: `PUT`
- URL: `https://backup-volabarato-1.onrender.com/api/reserva/<ID_DE_MI_RESERVA_DE_LA_PRUEBA_2>`

**2. Headers:**
```
Authorization: Bearer <MISMO_ID_TOKEN_DE_LA_PRUEBA_1>
Content-Type: application/json
```

**3. Body (raw JSON):**
```json
{
  "cantidadPersonas": 3
}
```

**4. Enviar**

✅ **Resultado esperado:**
- Status: `200 OK`
- La reserva se actualiza exitosamente

---

## ✅ Checklist de Verificación

- [ ] Prueba 1: Token Firebase obtenido correctamente
- [ ] Prueba 2: Reserva creada sin `usuario` en body
- [ ] Prueba 3: Mis reservas obtenidas sin `usuarioId` en query
- [ ] Prueba 4.1: Error 403 al intentar modificar reserva de otro usuario
- [ ] Prueba 4.2: Éxito al modificar mi propia reserva

---

## 🐛 Si Algo Falla

### Error 401: "Token inválido"
- El token expiró (válido por 1 hora)
- Obtén un nuevo token con la Prueba 1

### Error 400: "Paquete no encontrado"
- Verifica que el ID del paquete sea correcto
- Obtén un paquete válido: `GET /api/paquete`

### Error 404: "Reserva no encontrada"
- Verifica que el ID de la reserva sea correcto
- Usa el ID de la reserva que creaste en la Prueba 2

### Error 500: "Error interno del servidor"
- Revisa los logs del servidor
- Verifica que el backend esté corriendo

---

## 📝 Notas Rápidas

- **Token Firebase:** Válido por 1 hora
- **URL Base:** `https://backup-volabarato-1.onrender.com`
- **API Key Firebase:** `AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A`
- **Usuario de prueba:** `test@volabarato.com` / `12345678`

---

¿Listo? Empieza con la Prueba 1 y avanza secuencialmente. 🚀

