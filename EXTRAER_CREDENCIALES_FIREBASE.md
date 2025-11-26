# 🔑 Extraer Credenciales del JSON de Firebase

## 📋 Paso 1: Abrir el JSON Descargado

1. Busca el archivo JSON que descargaste (nombre similar a: `volabarato-c8c5a-firebase-adminsdk-xxxxx-xxxxxxxxxx.json`)
2. Ábrelo con cualquier editor de texto (Bloc de notas, VS Code, etc.)

## 📝 Paso 2: Identificar los Valores Necesarios

El JSON debería verse así:

```json
{
  "type": "service_account",
  "project_id": "volabarato-c8c5a",
  "private_key_id": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n[más líneas]\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@volabarato-c8c5a.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40volabarato-c8c5a.iam.gserviceaccount.com"
}
```

## ✅ Paso 3: Copiar los 3 Valores Necesarios

Necesitas copiar estos 3 valores del JSON:

### Valor 1: project_id
- **Busca la línea:** `"project_id": "volabarato-c8c5a"`
- **Copia solo el valor:** `volabarato-c8c5a` (sin las comillas)

### Valor 2: client_email
- **Busca la línea:** `"client_email": "firebase-adminsdk-xxxxx@volabarato-c8c5a.iam.gserviceaccount.com"`
- **Copia solo el valor:** `firebase-adminsdk-xxxxx@volabarato-c8c5a.iam.gserviceaccount.com` (sin las comillas)
- ⚠️ El `xxxxx` será diferente en tu caso

### Valor 3: private_key
- **Busca la línea:** `"private_key": "-----BEGIN PRIVATE KEY-----\n..."`
- **Este es el más importante y complicado:**
  - El valor de `private_key` es MUY LARGO (varias líneas)
  - Debe incluir: `-----BEGIN PRIVATE KEY-----` al inicio
  - Debe incluir: `-----END PRIVATE KEY-----` al final
  - Entre medio hay muchas líneas con caracteres aleatorios
  - Tiene `\n` que representan saltos de línea

**Cómo copiar private_key:**
1. Busca `"private_key": "`
2. Copia **TODO** desde `-----BEGIN PRIVATE KEY-----` hasta `-----END PRIVATE KEY-----\n"`
3. Incluye los `\n` (no los reemplaces por saltos de línea reales)
4. Debe terminar con `\n"` (antes de la comilla de cierre)

**Ejemplo de cómo debería verse:**
```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n[muchas líneas más]\n-----END PRIVATE KEY-----\n
```

## 📋 Resumen de lo que Necesitas

Tendrás estos 3 valores listos para pegar en Render:

1. **FIREBASE_PROJECT_ID**: `volabarato-c8c5a`
2. **FIREBASE_CLIENT_EMAIL**: `firebase-adminsdk-xxxxx@volabarato-c8c5a.iam.gserviceaccount.com`
3. **FIREBASE_PRIVATE_KEY**: `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n`

---

## ⚠️ IMPORTANTE sobre private_key

- **NO** reemplaces `\n` por saltos de línea reales
- **NO** agregues comillas adicionales
- **SÍ** copia exactamente como aparece en el JSON
- **SÍ** incluye `-----BEGIN PRIVATE KEY-----` y `-----END PRIVATE KEY-----`

---

¿Ya tienes los 3 valores copiados? ¡Perfecto! Ahora vamos a configurarlos en Render.

