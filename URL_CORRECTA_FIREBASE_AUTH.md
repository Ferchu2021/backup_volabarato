# 🔧 URL Correcta para Firebase Authentication REST API

## ❌ Error Actual

Estás recibiendo 404, lo que significa que la URL no es correcta o la API no está habilitada.

---

## ✅ URL Correcta

La URL correcta para Firebase Authentication REST API es:

```
POST https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=TU_API_KEY
```

**⚠️ IMPORTANTE:** Asegúrate de que:
- El método sea **POST** (no GET)
- La URL esté completa (con `https://`)
- El `key` esté en el query parameter

---

## 📋 Request Completo en Postman

### URL:
```
https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A
```

### Método:
```
POST
```

### Headers:
```
Content-Type: application/json
```

### Body (raw JSON):
```json
{
  "email": "test@volabarato.com",
  "password": "12345678",
  "returnSecureToken": true
}
```

---

## 🔍 Verificación en Postman

### Paso 1: Verificar la URL
1. En Postman, asegúrate de que la URL sea exactamente:
   ```
   https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A
   ```
2. **NO** debe tener espacios
3. **NO** debe tener saltos de línea
4. Debe empezar con `https://`

### Paso 2: Verificar el Método
- Debe ser **POST** (no GET, no PUT)

### Paso 3: Verificar el Body
- Body → raw → JSON
- Debe tener el formato correcto

---

## 🚨 Si Sigue Dando 404

### Opción 1: Verificar que Identity Toolkit API esté habilitada

1. Ve a: https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com?project=volabarato-c8c5a
2. Verifica que diga **"API enabled"** (API habilitada)
3. Si dice **"Enable"**, haz clic ahí

### Opción 2: Usar la URL alternativa (si la primera no funciona)

A veces Firebase usa una URL ligeramente diferente. Prueba:

```
POST https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A
```

**Body (mismo):**
```json
{
  "email": "test@volabarato.com",
  "password": "12345678",
  "returnSecureToken": true
}
```

---

## 📝 Ejemplo Completo de Request

### En Postman:

**1. Método y URL:**
```
POST https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A
```

**2. Headers:**
```
Content-Type: application/json
```

**3. Body (raw, JSON):**
```json
{
  "email": "test@volabarato.com",
  "password": "12345678",
  "returnSecureToken": true
}
```

---

## ✅ Checklist

- [ ] URL completa y correcta (con `https://`)
- [ ] Método es **POST** (no GET)
- [ ] Header `Content-Type: application/json` está presente
- [ ] Body está en formato JSON (raw → JSON)
- [ ] Identity Toolkit API está habilitada en Google Cloud Console
- [ ] El usuario `test@volabarato.com` existe en Firebase Authentication

---

¿Puedes verificar estos puntos y probar de nuevo? Si sigue dando 404, prueba la URL alternativa que mencioné arriba.

