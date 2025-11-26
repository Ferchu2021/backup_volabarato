# 🔥 Configurar Firebase en Render - Paso a Paso

## 📋 Información del Proyecto Firebase

- **Nombre del proyecto**: volabarato
- **ID del proyecto**: volabarato-c8c5a
- **Número del proyecto**: 300565876308

---

## 🔑 Paso 1: Obtener Credenciales del Service Account

### 1.1. Acceder a Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **volabarato** (ID: volabarato-c8c5a)

### 1.2. Generar Service Account Key

1. Haz clic en el **icono de engranaje** ⚙️ (arriba a la izquierda, junto al nombre del proyecto)
2. Selecciona **"Configuración del proyecto"**
3. Ve a la pestaña **"Cuentas de servicio"** (Service accounts)
4. Haz clic en **"Generar nueva clave privada"** (Generate new private key)
5. Se abrirá un diálogo de confirmación → Haz clic en **"Generar clave"**
6. Se descargará automáticamente un archivo JSON con un nombre como:
   ```
   volabarato-c8c5a-firebase-adminsdk-xxxxx-xxxxxxxxxx.json
   ```

### 1.3. Extraer Información del JSON

Abre el archivo JSON descargado. Debería verse así:

```json
{
  "type": "service_account",
  "project_id": "volabarato-c8c5a",
  "private_key_id": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@volabarato-c8c5a.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40volabarato-c8c5a.iam.gserviceaccount.com"
}
```

**Necesitas estos 3 valores:**
- ✅ `project_id`: `volabarato-c8c5a` (ya lo tienes)
- ✅ `client_email`: `firebase-adminsdk-xxxxx@volabarato-c8c5a.iam.gserviceaccount.com`
- ✅ `private_key`: Todo el valor incluyendo `-----BEGIN PRIVATE KEY-----` y `-----END PRIVATE KEY-----`

---

## 🔧 Paso 2: Configurar Variables de Entorno en Render

### 2.1. Acceder a Render

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Inicia sesión con tu cuenta
3. Busca y selecciona tu servicio: **backup_volabarato-1** (o el nombre que tenga)

### 2.2. Ir a Variables de Entorno

1. En el menú lateral izquierdo, haz clic en **"Environment"**
2. Verás una tabla con las variables de entorno existentes

### 2.3. Agregar Variable 1: FIREBASE_PROJECT_ID

1. Haz clic en **"Add Environment Variable"** (botón arriba a la derecha)
2. **Key**: `FIREBASE_PROJECT_ID`
3. **Value**: `volabarato-c8c5a`
4. Haz clic en **"Save"**

### 2.4. Agregar Variable 2: FIREBASE_CLIENT_EMAIL

1. Haz clic en **"Add Environment Variable"** nuevamente
2. **Key**: `FIREBASE_CLIENT_EMAIL`
3. **Value**: Copia el valor de `client_email` del JSON (ejemplo: `firebase-adminsdk-xxxxx@volabarato-c8c5a.iam.gserviceaccount.com`)
4. Haz clic en **"Save"**

### 2.5. Agregar Variable 3: FIREBASE_PRIVATE_KEY

1. Haz clic en **"Add Environment Variable"** nuevamente
2. **Key**: `FIREBASE_PRIVATE_KEY`
3. **Value**: Copia **TODO** el valor de `private_key` del JSON, incluyendo:
   ```
   -----BEGIN PRIVATE KEY-----
   MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
   [todo el contenido en múltiples líneas]
   -----END PRIVATE KEY-----
   ```
   
   **⚠️ IMPORTANTE:**
   - Copia exactamente como aparece en el JSON
   - Mantén los saltos de línea (`\n`) como están
   - No agregues comillas adicionales
   - Debe incluir `-----BEGIN PRIVATE KEY-----` al inicio y `-----END PRIVATE KEY-----` al final

4. Haz clic en **"Save"**

### 2.6. Verificar Variables

Después de agregar las tres variables, deberías ver en la tabla:

| Key | Value | Sync | Actions |
|-----|-------|------|---------|
| FIREBASE_PROJECT_ID | `volabarato-c8c5a` | - | ✏️ 👁️ |
| FIREBASE_CLIENT_EMAIL | `firebase-adminsdk-...` | - | ✏️ 👁️ |
| FIREBASE_PRIVATE_KEY | `-----BEGIN PRIVATE KEY-----...` | - | ✏️ 👁️ |

---

## ✅ Paso 3: Verificar que se Aplicaron los Cambios

### 3.1. Reinicio Automático

- Render reiniciará automáticamente el servicio cuando agregues/edites variables de entorno
- Esto puede tardar **1-2 minutos**

### 3.2. Verificar en Logs

1. Ve a la pestaña **"Logs"** (menú lateral izquierdo)
2. Espera a que el servicio termine de reiniciar
3. Busca estos mensajes:

   **✅ Éxito:**
   ```
   ✅ Firebase Admin inicializado correctamente
      Proyecto: volabarato-c8c5a
   ```

   **❌ Error (si algo está mal):**
   ```
   ⚠️ Firebase Admin no configurado: Faltan variables de entorno
   ```
   o
   ```
   ❌ Error inicializando Firebase Admin: [mensaje de error]
   ```

### 3.3. Probar Endpoint de Estado

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

**Si hay error:**
```json
{
  "status": "not_configured",
  "message": "Firebase Admin no está configurado",
  "error": "Faltan variables de entorno: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY"
}
```

---

## 🔍 Solución de Problemas

### Problema: "Firebase Admin no está configurado"

**Causa:** Faltan variables de entorno o están mal configuradas.

**Solución:**
1. Verifica que las tres variables estén en Render:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
2. Verifica que los valores sean correctos (sin espacios extra al inicio/final)
3. Verifica que `FIREBASE_PRIVATE_KEY` incluya los saltos de línea (`\n`)

### Problema: "Error inicializando Firebase Admin"

**Causa:** La clave privada está mal formateada.

**Solución:**
1. Asegúrate de copiar **TODO** el valor de `private_key` del JSON
2. Debe incluir `-----BEGIN PRIVATE KEY-----` y `-----END PRIVATE KEY-----`
3. No agregues comillas adicionales
4. Mantén los saltos de línea como están

### Problema: El servicio no se reinicia

**Solución:**
1. Espera 1-2 minutos
2. Si no se reinicia, ve a **"Manual Deploy"** → **"Deploy latest commit"**
3. O simplemente espera, Render puede tardar un poco

---

## 📝 Resumen de Variables Requeridas

```
FIREBASE_PROJECT_ID = volabarato-c8c5a
FIREBASE_CLIENT_EMAIL = firebase-adminsdk-xxxxx@volabarato-c8c5a.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
```

---

## ✅ Checklist de Verificación

- [ ] ✅ Service Account JSON descargado de Firebase
- [ ] ✅ `FIREBASE_PROJECT_ID` configurado en Render: `volabarato-c8c5a`
- [ ] ✅ `FIREBASE_CLIENT_EMAIL` configurado en Render (del JSON)
- [ ] ✅ `FIREBASE_PRIVATE_KEY` configurado en Render (del JSON, con saltos de línea)
- [ ] ✅ Servicio reiniciado en Render
- [ ] ✅ Logs muestran: `✅ Firebase Admin inicializado correctamente`
- [ ] ✅ Endpoint `/api/firebase/status` responde con `"status": "configured"`

---

## 🎯 Próximo Paso

Una vez que Firebase esté configurado correctamente en Render:

1. ✅ Crear app web en Firebase (para obtener `apiKey`)
2. ✅ Crear usuario de prueba en Firebase Authentication
3. ✅ Obtener token de Firebase desde Postman
4. ✅ Probar endpoint `/api/firebase/profile` con el token

**Ver guía completa:** `GUIA_FIREBASE_AUTH_INTEGRACION.md`

---

¿Necesitas ayuda con algún paso? ¡Avísame!

