# ✅ Paso 3: Probar Autenticación en el Backend

## 🎉 ¡Firebase Authentication Funciona!

Ya obtuviste el token de Firebase. Ahora vamos a probar que tu backend lo acepta correctamente.

---

## 📝 Request para Probar el Backend

### Método:
```
GET
```

### URL:
```
https://backup-volabarato-1.onrender.com/api/firebase/profile
```

### Headers:
```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ1YTZjMGMyYjgwMDcxN2EzNGQ1Y2JiYmYzOWI4NGI2NzYxMjgyNjUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdm9sYWJhcmF0by1jOGM1YSIsImF1ZCI6InZvbGFiYXJhdG8tYzhjNWEiLCJhdXRoX3RpbWUiOjE3NjQyMDkxNDksInVzZXJfaWQiOiJYdW1JakwwN1JRUlJVREhWZzZ5Y291c1NHMWgyIiwic3ViIjoiWHVtSWpMMDdSUVJSVURIVmc2eWNvdXNTRzFoMiIsImlhdCI6MTc2NDIwOTE0OSwiZXhwIjoxNzY0MjEyNzQ5LCJlbWFpbCI6InRlc3RAdm9sYWJhcmF0by5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEB2b2xhYmFyYXRvLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.MY3IQ6PIXssfED9W378k5KXItZ4CcEUXg1gvSeVYXO7kJlyBaUCKt30xga4yZ3ftYXpdHhIdlKDrwSW2y9FGeRTpZAmbA3tzmkvT_GlEZ0avgFQK8JRmtFQDsW1uA9e22KOy4DfL-2ZVz5cAxPXbfGAKShCJz2ndaUklQtkJkka-aXejS1aYNbtU1Xat2bXm3qE2plLt5GTDZEQELmpsQUbFaS_dC4tK9xVwP8LIAvA-VYwxSTeQwsZ5SFD8NwNfyWsloi5ros1SEwraaT0xLnAL-IQw0Jrtmprh88ju2uInjQm_Mr2LOKCm9jVUWXgIxcWspgQ0vRhERWI63BDCQg
```

**⚠️ IMPORTANTE:** 
- Reemplaza el token con el `idToken` que obtuviste en el paso anterior
- El formato es: `Bearer <token>` (con un espacio después de "Bearer")

---

## 🔧 Configuración en Postman

### Paso 1: Crear nuevo Request
1. Crea un nuevo request en Postman
2. Método: **GET**

### Paso 2: URL
```
https://backup-volabarato-1.onrender.com/api/firebase/profile
```

### Paso 3: Headers
1. Ve a la pestaña **"Headers"**
2. Agrega:
   - **Key:** `Authorization`
   - **Value:** `Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ1YTZjMGMyYjgwMDcxN2EzNGQ1Y2JiYmYzOWI4NGI2NzYxMjgyNjUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdm9sYWJhcmF0by1jOGM1YSIsImF1ZCI6InZvbGFiYXJhdG8tYzhjNWEiLCJhdXRoX3RpbWUiOjE3NjQyMDkxNDksInVzZXJfaWQiOiJYdW1JakwwN1JRUlJVREhWZzZ5Y291c1NHMWgyIiwic3ViIjoiWHVtSWpMMDdSUVJSVURIVmc2eWNvdXNTRzFoMiIsImlhdCI6MTc2NDIwOTE0OSwiZXhwIjoxNzY0MjEyNzQ5LCJlbWFpbCI6InRlc3RAdm9sYWJhcmF0by5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEB2b2xhYmFyYXRvLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.MY3IQ6PIXssfED9W378k5KXItZ4CcEUXg1gvSeVYXO7kJlyBaUCKt30xga4yZ3ftYXpdHhIdlKDrwSW2y9FGeRTpZAmbA3tzmkvT_GlEZ0avgFQK8JRmtFQDsW1uA9e22KOy4DfL-2ZVz5cAxPXbfGAKShCJz2ndaUklQtkJkka-aXejS1aYNbtU1Xat2bXm3qE2plLt5GTDZEQELmpsQUbFaS_dC4tK9xVwP8LIAvA-VYwxSTeQwsZ5SFD8NwNfyWsloi5ros1SEwraaT0xLnAL-IQw0Jrtmprh88ju2uInjQm_Mr2LOKCm9jVUWXgIxcWspgQ0vRhERWI63BDCQg`
   - **⚠️ IMPORTANTE:** Debe empezar con `Bearer ` (con espacio después)

### Paso 4: Enviar Request
Haz clic en **"Send"**

---

## ✅ Respuesta Esperada (Éxito)

Si todo funciona correctamente, deberías recibir:

```json
{
  "message": "Firebase Auth OK",
  "user": {
    "uid": "XumIjL07RQRRUDHVg6ycousSG1h2",
    "email": "test@volabarato.com",
    "email_verified": false,
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

**✅ Si ves esto:** ¡La integración completa de Firebase Authentication está funcionando correctamente!

---

## ❌ Posibles Errores

### Error 401 - Token inválido o expirado
- El token expiró (los tokens expiran después de 1 hora)
- **Solución:** Obtén un nuevo token usando el paso anterior

### Error 503 - Servicio no disponible
- Firebase Admin no está configurado en Render
- **Solución:** Verifica que las variables de entorno estén configuradas en Render

### Error 404 - Endpoint no encontrado
- El endpoint no existe o la URL es incorrecta
- **Solución:** Verifica que la URL sea correcta y que el backend esté desplegado

---

## 🎯 Resumen de Verificación Completa

### ✅ Paso 1: Verificar Estado de Firebase
```
GET https://backup-volabarato-1.onrender.com/api/firebase/status
```
**Resultado esperado:** `"status": "configured"`

### ✅ Paso 2: Obtener Token de Firebase
```
POST https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A
```
**Resultado esperado:** `idToken` en la respuesta ✅ (YA LO TIENES)

### ✅ Paso 3: Probar Autenticación en Backend
```
GET https://backup-volabarato-1.onrender.com/api/firebase/profile
Header: Authorization: Bearer <idToken>
```
**Resultado esperado:** Información del usuario autenticado

---

## 🎉 ¡Próximos Pasos!

Una vez que el Paso 3 funcione, tendrás:
- ✅ Firebase Admin configurado en el backend
- ✅ Autenticación con Firebase funcionando
- ✅ Tokens de Firebase siendo verificados en tu backend
- ✅ Integración completa lista para usar

---

¿Probaste el Paso 3? ¿Qué resultado obtuviste?

