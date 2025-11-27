# ✅ Verificación de Firebase en Postman

## 📋 Checklist de Verificación

### 1. ✅ Verificar que Firebase Admin esté funcionando en Render

**Request:**
```
GET https://backup-volabarato-1.onrender.com/api/firebase/status
```

**Respuesta esperada:**
```json
{
  "status": "configured",
  "message": "Firebase Admin está configurado correctamente",
  "projectId": "volabarato-c8c5a",
  "timestamp": "2025-11-27T..."
}
```

**✅ Si ves esto:** Firebase Admin está configurado correctamente en el backend.

---

### 2. ✅ Obtener Token de Firebase desde Postman

**Request:**
```
POST https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "test@volabarato.com",
  "password": "12345678",
  "returnSecureToken": true
}
```

**Respuesta esperada:**
```json
{
  "kind": "identitytoolkit#VerifyPasswordResponse",
  "localId": "xxxxxxxxxxxxxxxxxxxx",
  "email": "test@volabarato.com",
  "displayName": "",
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...",
  "registered": true,
  "refreshToken": "AEu4IL...",
  "expiresIn": "3600"
}
```

**✅ Si ves esto:** Puedes obtener tokens de Firebase correctamente.

**⚠️ IMPORTANTE:** Copia el valor de `idToken` - lo necesitarás para el siguiente paso.

---

### 3. ✅ Probar Autenticación Firebase en tu Backend

**Request:**
```
GET https://backup-volabarato-1.onrender.com/api/firebase/profile
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...
```

(Reemplaza el token con el `idToken` que obtuviste en el paso 2)

**Respuesta esperada (éxito):**
```json
{
  "message": "Firebase Auth OK",
  "user": {
    "uid": "xxxxxxxxxxxxxxxxxxxx",
    "email": "test@volabarato.com",
    "emailVerified": false,
    "displayName": null,
    "photoURL": null,
    "disabled": false,
    "metadata": {
      "creationTime": "2025-11-27T...",
      "lastSignInTime": "2025-11-27T..."
    },
    "customClaims": null
  }
}
```

**✅ Si ves esto:** La integración completa de Firebase Authentication está funcionando correctamente.

**❌ Si ves error 401:**
- Verifica que el token no haya expirado (los tokens expiran después de 1 hora)
- Obtén un nuevo token usando el paso 2

**❌ Si ves error 503:**
- Verifica que Firebase Admin esté configurado en Render
- Revisa los logs de Render

---

## 🎯 Resumen de Verificación

### ✅ Integración Completa si:

- [ ] ✅ Endpoint `/api/firebase/status` responde con `"status": "configured"`
- [ ] ✅ Puedes obtener `idToken` desde Firebase usando `signInWithPassword`
- [ ] ✅ Endpoint `/api/firebase/profile` funciona con el token de Firebase
- [ ] ✅ Recibes información del usuario autenticado

---

## 📝 Requests para Crear en Postman

### Request 1: Verificar Estado de Firebase
- **Método:** GET
- **URL:** `https://backup-volabarato-1.onrender.com/api/firebase/status`
- **Headers:** Ninguno requerido

### Request 2: Obtener Token de Firebase
- **Método:** POST
- **URL:** `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "test@volabarato.com",
    "password": "12345678",
    "returnSecureToken": true
  }
  ```

### Request 3: Obtener Perfil con Firebase Token
- **Método:** GET
- **URL:** `https://backup-volabarato-1.onrender.com/api/firebase/profile`
- **Headers:** `Authorization: Bearer {{firebase_token}}`
- **Variables:** Crea una variable `firebase_token` y guarda el `idToken` del Request 2

---

## 🔧 Configurar Variables en Postman

Para facilitar las pruebas, crea estas variables en tu colección o entorno:

1. **base_url**: `https://backup-volabarato-1.onrender.com`
2. **firebase_api_key**: `AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A`
3. **firebase_token**: (se llena automáticamente después del Request 2)

---

## ✅ Todo está bien si...

1. ✅ Puedes verificar el estado de Firebase
2. ✅ Puedes obtener tokens de Firebase
3. ✅ Puedes autenticarte en tu backend con tokens de Firebase
4. ✅ Recibes información del usuario autenticado

---

¿Necesitas ayuda con algún paso específico?

