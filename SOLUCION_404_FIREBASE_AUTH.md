# 🔧 Solución: Error 404 en Firebase Authentication

## 📋 Situación Actual

- ✅ Identity Toolkit API está habilitada
- ❌ Sigue recibiendo 404 al llamar `signInWithPassword`

---

## ✅ Solución: Usar URL Alternativa

Firebase tiene dos endpoints para autenticación. Si el primero da 404, usa el segundo:

### **Opción 1: URL Principal (la que ya probaste)**
```
POST https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A
```

### **Opción 2: URL Alternativa (PRUEBA ESTA) ⭐**
```
POST https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A
```

**Esta es la URL que debes usar ahora.**

---

## 📝 Request Completo en Postman (Opción 2)

### 1. Método:
```
POST
```

### 2. URL:
```
https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A
```

### 3. Headers:
```
Content-Type: application/json
```

### 4. Body (raw → JSON):
```json
{
  "email": "test@volabarato.com",
  "password": "12345678",
  "returnSecureToken": true
}
```

---

## 🔍 Verificación Rápida

### Antes de probar, verifica:

1. **¿El usuario existe en Firebase?**
   - Ve a Firebase Console → Authentication → Users
   - Debe existir un usuario con email `test@volabarato.com`
   - Si no existe, créalo primero

2. **¿La API está realmente habilitada?**
   - Ve a: https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com?project=volabarato-c8c5a
   - Debe decir **"API enabled"** (no "Enable")

3. **¿El API key es correcto?**
   - Ve a Firebase Console → Configuración del proyecto → General
   - Verifica que el API key sea: `AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A`

---

## 🎯 Pasos a Seguir

### Paso 1: Verificar que el usuario existe
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **volabarato**
3. Ve a **Authentication** → **Users**
4. Si no existe `test@volabarato.com`, haz clic en **"Add user"** y créalo

### Paso 2: Probar con la URL alternativa
1. Abre Postman
2. Crea un nuevo request
3. Método: **POST**
4. URL: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A`
5. Headers: `Content-Type: application/json`
6. Body (raw, JSON):
   ```json
   {
     "email": "test@volabarato.com",
     "password": "12345678",
     "returnSecureToken": true
   }
   ```
7. Envía el request

---

## ✅ Respuesta Esperada (Éxito)

Si funciona, deberías recibir:

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

**✅ Copia el `idToken` - lo necesitarás para autenticarte en tu backend.**

---

## ❌ Si Sigue Dando Error

### Error 400 - INVALID_PASSWORD:
- La contraseña es incorrecta
- Verifica la contraseña del usuario en Firebase Console

### Error 400 - EMAIL_NOT_FOUND:
- El usuario no existe
- Créalo en Firebase Console → Authentication → Users

### Error 403 - API_KEY_INVALID:
- El API key no es válido o tiene restricciones
- Verifica el API key en Firebase Console

### Error 404:
- Prueba esperar 2-3 minutos (a veces hay delay en la propagación)
- Verifica que la URL esté exactamente como se muestra arriba
- Asegúrate de que el método sea **POST** (no GET)

---

## 🎯 Resumen

**Para el paso 1, usa la Opción 2 (URL alternativa):**

```
POST https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A
```

Esta URL es la más confiable cuando la primera da 404.

---

¿Probaste con esta URL? ¿Qué resultado obtuviste?

