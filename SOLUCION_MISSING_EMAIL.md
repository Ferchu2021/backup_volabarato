# 🔧 Solución: Error "MISSING_EMAIL" en Firebase Auth

## ❌ Error Actual

```json
{
    "error": {
        "code": 400,
        "message": "MISSING_EMAIL",
        "errors": [
            {
                "message": "MISSING_EMAIL",
                "domain": "global",
                "reason": "invalid"
            }
        ]
    }
}
```

**Esto significa que el email no está llegando al servidor de Firebase.**

---

## ✅ Solución: Configurar Correctamente el Body en Postman

El problema es que el body no está siendo enviado correctamente. Sigue estos pasos **exactamente**:

---

## 📝 Configuración Paso a Paso en Postman

### Paso 1: Método y URL

1. **Método:** Selecciona **POST** (no GET, no PUT)
2. **URL:** 
   ```
   https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A
   ```

### Paso 2: Headers (MUY IMPORTANTE)

1. Haz clic en la pestaña **"Headers"**
2. Agrega este header:
   - **Key:** `Content-Type`
   - **Value:** `application/json`
3. **⚠️ IMPORTANTE:** Asegúrate de que NO haya un checkbox desmarcado al lado del header. Si hay un checkbox, debe estar **marcado** (habilitado).

### Paso 3: Body (LA PARTE MÁS IMPORTANTE)

1. Haz clic en la pestaña **"Body"**
2. Selecciona la opción **"raw"** (no "form-data", no "x-www-form-urlencoded")
3. En el dropdown que aparece a la derecha de "raw", selecciona **"JSON"** (no "Text", no "JavaScript")
4. En el área de texto, pega **exactamente** esto (sin espacios extra, sin saltos de línea al inicio):

```json
{
  "email": "test@volabarato.com",
  "password": "12345678",
  "returnSecureToken": true
}
```

**⚠️ VERIFICA:**
- No debe haber espacios antes de `{`
- No debe haber saltos de línea al inicio
- Debe empezar directamente con `{`
- Las comillas deben ser comillas dobles `"` (no comillas simples `'`)
- No debe haber comas al final de las líneas (excepto donde corresponde)

---

## 🔍 Verificación Visual en Postman

Tu configuración debe verse así:

```
┌─────────────────────────────────────────────────────────┐
│ POST  [URL aquí]                                        │
├─────────────────────────────────────────────────────────┤
│ Params | Authorization | Headers | Body | Pre-request │
├─────────────────────────────────────────────────────────┤
│ Headers:                                                │
│                                                         │
│ Content-Type  |  application/json  ☑                    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ Body:                                                   │
│                                                         │
│ ○ none  ○ form-data  ○ x-www-form-urlencoded            │
│ ● raw  ○ binary  ○ GraphQL                             │
│                                                         │
│ [JSON ▼]  ← Debe decir "JSON" aquí                     │
│                                                         │
│ {                                                       │
│   "email": "test@volabarato.com",                       │
│   "password": "12345678",                              │
│   "returnSecureToken": true                            │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
```

---

## 🚨 Errores Comunes

### ❌ Error 1: Body en formato incorrecto
- **Mal:** Body → form-data
- **Mal:** Body → x-www-form-urlencoded
- **Bien:** Body → raw → JSON

### ❌ Error 2: Content-Type faltante
- **Mal:** No hay header Content-Type
- **Bien:** Header `Content-Type: application/json` presente y habilitado

### ❌ Error 3: Body vacío o mal formateado
- **Mal:** Body vacío
- **Mal:** JSON con errores de sintaxis
- **Bien:** JSON válido con email, password y returnSecureToken

### ❌ Error 4: Email con espacios o formato incorrecto
- **Mal:** `"email": " test@volabarato.com "` (con espacios)
- **Mal:** `"email": 'test@volabarato.com'` (comillas simples)
- **Bien:** `"email": "test@volabarato.com"` (sin espacios, comillas dobles)

---

## ✅ Checklist Antes de Enviar

Antes de hacer clic en "Send", verifica:

- [ ] Método es **POST**
- [ ] URL es correcta (con `https://`)
- [ ] Header `Content-Type: application/json` está presente y **habilitado** (checkbox marcado)
- [ ] Body está en modo **raw**
- [ ] El dropdown del body dice **JSON** (no "Text")
- [ ] El JSON empieza con `{` (sin espacios antes)
- [ ] El email está entre comillas dobles: `"email": "test@volabarato.com"`
- [ ] No hay comas al final de las líneas (excepto donde corresponde)
- [ ] El JSON termina con `}`

---

## 🎯 Ejemplo de JSON Correcto

Copia y pega esto **exactamente** en el body (raw → JSON):

```json
{
  "email": "test@volabarato.com",
  "password": "12345678",
  "returnSecureToken": true
}
```

**NO copies esto:**
- ❌ Con espacios al inicio: `   {`
- ❌ Con comillas simples: `'email'`
- ❌ Con comas al final: `"email": "test@volabarato.com",` (la última línea no debe tener coma)
- ❌ Con saltos de línea extra

---

## 🔧 Si Sigue Dando MISSING_EMAIL

### Opción 1: Verificar que el Body se está enviando

1. En Postman, después de enviar el request, ve a la pestaña **"Console"** (abajo)
2. Busca la sección **"Request"**
3. Verifica que el body esté ahí y sea correcto

### Opción 2: Probar con cURL

Si Postman sigue dando problemas, prueba con este comando en PowerShell:

```powershell
$body = @{
    email = "test@volabarato.com"
    password = "12345678"
    returnSecureToken = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A" -Method Post -Body $body -ContentType "application/json"
```

### Opción 3: Verificar el usuario en Firebase

Asegúrate de que el usuario existe:
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **volabarato**
3. Ve a **Authentication** → **Users**
4. Verifica que existe `test@volabarato.com`
5. Si no existe, créalo con la contraseña `12345678`

---

## 📸 Captura de Pantalla de Referencia

Tu Postman debe verse así:

**Headers:**
```
Content-Type: application/json
```

**Body (raw, JSON):**
```json
{
  "email": "test@volabarato.com",
  "password": "12345678",
  "returnSecureToken": true
}
```

---

## ✅ Resultado Esperado

Si todo está correcto, deberías recibir:

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

---

¿Puedes verificar estos puntos y probar de nuevo? El problema más común es que el body no esté en formato JSON o que el header Content-Type no esté configurado.

