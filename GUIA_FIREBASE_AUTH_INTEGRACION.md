# 🔥 Guía Completa: Integración Firebase Authentication en VolaBarato

## 📋 Resumen

Esta guía te ayudará a integrar **Firebase Authentication** en tu backend de VolaBarato desplegado en Render, permitiendo que los usuarios se autentiquen con Firebase y que tu backend verifique esos tokens.

---

## 🎯 Objetivo

- ✅ Usuarios se autentican con Firebase (Email/Password)
- ✅ Backend en Render verifica tokens de Firebase
- ✅ Endpoints protegidos funcionan con tokens de Firebase
- ✅ Compatible con el sistema JWT existente (ambos funcionan en paralelo)

---

## 📝 Paso 1: Obtener Credenciales de Firebase

### 1.1. Crear Service Account en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **volabarato-c8c5a**
3. Haz clic en el **icono de engranaje** ⚙️ (arriba a la izquierda)
4. Selecciona **"Configuración del proyecto"**
5. Ve a la pestaña **"Cuentas de servicio"**
6. Haz clic en **"Generar nueva clave privada"**
7. Se descargará un archivo JSON (ej: `volabarato-c8c5a-firebase-adminsdk-xxxxx.json`)

### 1.2. Extraer Información del JSON

Abre el archivo JSON descargado. Necesitarás estos valores:

```json
{
  "project_id": "volabarato-c8c5a",
  "client_email": "firebase-adminsdk-xxxxx@volabarato-c8c5a.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
}
```

**⚠️ IMPORTANTE:**
- **project_id** → será `FIREBASE_PROJECT_ID`
- **client_email** → será `FIREBASE_CLIENT_EMAIL`
- **private_key** → será `FIREBASE_PRIVATE_KEY` (mantén los `\n` como están)

---

## 🔧 Paso 2: Configurar Variables de Entorno en Render

### 2.1. Acceder a Variables de Entorno en Render

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Selecciona tu servicio: **backup_volabarato-1**
3. En el menú lateral, haz clic en **"Environment"**

### 2.2. Agregar Variables de Firebase

Haz clic en **"Add Environment Variable"** y agrega estas tres variables:

#### Variable 1: FIREBASE_PROJECT_ID
- **Key**: `FIREBASE_PROJECT_ID`
- **Value**: `volabarato-c8c5a` (o el project_id de tu JSON)

#### Variable 2: FIREBASE_CLIENT_EMAIL
- **Key**: `FIREBASE_CLIENT_EMAIL`
- **Value**: `firebase-adminsdk-xxxxx@volabarato-c8c5a.iam.gserviceaccount.com` (el client_email del JSON)

#### Variable 3: FIREBASE_PRIVATE_KEY
- **Key**: `FIREBASE_PRIVATE_KEY`
- **Value**: Pega toda la clave privada del JSON, incluyendo:
  ```
  -----BEGIN PRIVATE KEY-----
  [todo el contenido]
  -----END PRIVATE KEY-----
  ```
  
  **⚠️ IMPORTANTE:** 
  - Mantén los saltos de línea (`\n`) como están
  - No agregues comillas adicionales
  - Copia y pega exactamente como aparece en el JSON

### 2.3. Guardar y Reiniciar

1. Haz clic en **"Save Changes"**
2. Render reiniciará automáticamente el servicio (puede tardar 1-2 minutos)
3. Ve a la pestaña **"Logs"** para verificar que no hay errores

---

## ✅ Paso 3: Verificar que Firebase está Configurado

### 3.1. Verificar Estado de Firebase

Haz una petición GET a:

```
GET https://backup-volabarato-1.onrender.com/api/firebase/status
```

**Respuesta esperada (éxito):**
```json
{
  "status": "configured",
  "message": "Firebase Admin está configurado correctamente",
  "projectId": "volabarato-c8c5a",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Respuesta si falta configuración:**
```json
{
  "status": "not_configured",
  "message": "Firebase Admin no está configurado",
  "error": "Faltan variables de entorno: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY"
}
```

### 3.2. Verificar en Logs de Render

En la pestaña **"Logs"** de Render, deberías ver:

```
✅ Firebase Admin inicializado correctamente
   Proyecto: volabarato-c8c5a
```

Si ves errores, revisa que las variables de entorno estén correctamente configuradas.

---

## 🌐 Paso 4: Crear App Web en Firebase

### 4.1. Agregar App Web

1. En Firebase Console, ve a **"Configuración del proyecto"** (icono ⚙️)
2. Baja hasta la sección **"Tus apps"**
3. Haz clic en el icono **`</>`** (Agregar app web)
4. Ingresa un nombre: `VolaBarato Web` (o el que prefieras)
5. **NO marques** "También configura Firebase Hosting" (por ahora)
6. Haz clic en **"Registrar app"**

### 4.2. Copiar Configuración

Se mostrará un objeto de configuración como:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "volabarato-c8c5a.firebaseapp.com",
  projectId: "volabarato-c8c5a",
  storageBucket: "volabarato-c8c5a.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

**Guarda el `apiKey`** - lo necesitarás para obtener tokens desde Postman.

---

## 🧪 Paso 5: Obtener Token de Firebase desde Postman

### 5.1. Crear Usuario de Prueba en Firebase

1. En Firebase Console, ve a **"Authentication"** → **"Usuarios"**
2. Haz clic en **"Agregar usuario"**
3. Ingresa:
   - **Email**: `test@volabarato.com`
   - **Contraseña**: `12345678`
4. Haz clic en **"Agregar"**

### 5.2. Obtener Token con Postman

Crea una nueva request en Postman:

**Request:**
```
POST https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=TU_API_KEY
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

**Reemplaza `TU_API_KEY`** con el `apiKey` que copiaste en el Paso 4.2.

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

**⚠️ IMPORTANTE:** Copia el valor de `idToken` - este es el token que usarás para autenticarte en tu backend.

---

## 🔐 Paso 6: Probar Autenticación Firebase en el Backend

### 6.1. Endpoint de Prueba: Obtener Perfil

Crea una nueva request en Postman:

**Request:**
```
GET https://backup-volabarato-1.onrender.com/api/firebase/profile
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...
```

**Reemplaza el token** con el `idToken` que obtuviste en el Paso 5.2.

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
      "creationTime": "2024-01-15T10:00:00.000Z",
      "lastSignInTime": "2024-01-15T10:30:00.000Z"
    },
    "customClaims": null
  }
}
```

**Si el token es inválido o expiró:**
```json
{
  "error": "Token inválido",
  "message": "No se pudo verificar el token de Firebase."
}
```

---

## 📊 Paso 7: Verificar Integración Completa

### Checklist de Verificación

- [ ] ✅ Firebase Authentication habilitado (Email/Password)
- [ ] ✅ Usuario de prueba creado en Firebase
- [ ] ✅ Variables de entorno configuradas en Render:
  - [ ] `FIREBASE_PROJECT_ID`
  - [ ] `FIREBASE_CLIENT_EMAIL`
  - [ ] `FIREBASE_PRIVATE_KEY`
- [ ] ✅ App web creada en Firebase
- [ ] ✅ `apiKey` copiado de Firebase
- [ ] ✅ Endpoint `/api/firebase/status` responde con `"status": "configured"`
- [ ] ✅ Logs de Render muestran: `✅ Firebase Admin inicializado correctamente`
- [ ] ✅ Puedo obtener `idToken` desde Postman usando `signInWithPassword`
- [ ] ✅ Endpoint `/api/firebase/profile` funciona con el token de Firebase

---

## 🎯 Endpoints Disponibles

### 1. Verificar Estado de Firebase
```
GET /api/firebase/status
```
- **Sin autenticación requerida**
- Verifica que Firebase Admin esté configurado

### 2. Obtener Perfil de Usuario
```
GET /api/firebase/profile
```
- **Requiere autenticación Firebase**
- Header: `Authorization: Bearer <idToken>`
- Devuelve información del usuario autenticado

---

## 🔧 Solución de Problemas

### Error: "Firebase Admin no está configurado"

**Causa:** Faltan variables de entorno en Render.

**Solución:**
1. Verifica que las tres variables estén configuradas en Render
2. Verifica que los valores sean correctos (sin espacios extra)
3. Reinicia el servicio en Render

### Error: "Token inválido"

**Causa:** El token expiró o es incorrecto.

**Solución:**
1. Obtén un nuevo token usando `signInWithPassword`
2. Los tokens de Firebase expiran después de 1 hora
3. Verifica que estés usando el `idToken` (no el `refreshToken`)

### Error: "Token expirado"

**Causa:** El token de Firebase ha expirado.

**Solución:**
1. Obtén un nuevo token usando `signInWithPassword`
2. Los tokens de Firebase tienen una expiración de 1 hora

### Error en Logs: "Error inicializando Firebase Admin"

**Causa:** La clave privada está mal formateada.

**Solución:**
1. Verifica que `FIREBASE_PRIVATE_KEY` incluya los saltos de línea (`\n`)
2. Copia exactamente como aparece en el JSON descargado
3. No agregues comillas adicionales

---

## 📝 Notas Importantes

1. **Tokens de Firebase expiran:** Los `idToken` expiran después de 1 hora. Necesitarás obtener nuevos tokens periódicamente.

2. **JWT y Firebase funcionan en paralelo:** El sistema JWT existente sigue funcionando. Firebase es una opción adicional.

3. **Seguridad:** Nunca compartas tu `FIREBASE_PRIVATE_KEY` o `apiKey` públicamente. Son credenciales sensibles.

4. **Producción:** En producción, considera implementar refresh tokens para renovar automáticamente los tokens expirados.

---

## 🎉 ¡Listo!

Ahora tienes Firebase Authentication integrado en tu backend de Render. Los usuarios pueden:
- Autenticarse con Firebase (Email/Password)
- Obtener tokens de Firebase
- Usar esos tokens para acceder a endpoints protegidos en tu backend

**Próximos pasos sugeridos:**
- Integrar Firebase Auth en el frontend
- Implementar refresh tokens
- Agregar más proveedores de autenticación (Google, Facebook, etc.)

---

## 📚 Recursos Adicionales

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Firebase Authentication REST API](https://firebase.google.com/docs/reference/rest/auth)
- [Render Environment Variables](https://render.com/docs/environment-variables)

---

¿Necesitas ayuda con algún paso? ¡Avísame!

