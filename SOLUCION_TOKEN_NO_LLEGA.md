# 🔧 Solución: "Token Firebase requerido" - El Token No Llega

## ❌ Error Actual

```json
{
    "error": "Acceso denegado. Token Firebase requerido.",
    "message": "Incluye el token en el header: Authorization: Bearer <token>"
}
```

**Esto significa que el header `Authorization` no está configurado correctamente en Postman.**

---

## ✅ Solución: Configurar Correctamente el Header Authorization

El problema es que el header `Authorization` no está siendo enviado o no tiene el formato correcto.

---

## 📝 Configuración Paso a Paso en Postman

### Paso 1: Abrir la Pestaña "Headers"

1. En Postman, asegúrate de estar en la pestaña **"Headers"** (no "Body", no "Params")

### Paso 2: Agregar el Header Authorization

1. Haz clic en **"Add Header"** o en el campo vacío
2. En el campo **Key** (izquierda), escribe exactamente:
   ```
   Authorization
   ```
   - **⚠️ IMPORTANTE:** Debe ser exactamente `Authorization` (con A mayúscula, sin espacios)
   - **NO** debe ser: `authorization`, `Authorization:`, `Authorization `, etc.

3. En el campo **Value** (derecha), escribe:
   ```
   Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ1YTZjMGMyYjgwMDcxN2EzNGQ1Y2JiYmYzOWI4NGI2NzYxMjgyNjUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdm9sYWJhcmF0by1jOGM1YSIsImF1ZCI6InZvbGFiYXJhdG8tYzhjNWEiLCJhdXRoX3RpbWUiOjE3NjQyMDkxNDksInVzZXJfaWQiOiJYdW1JakwwN1JRUlJVREhWZzZ5Y291c1NHMWgyIiwic3ViIjoiWHVtSWpMMDdSUVJSVURIVmc2eWNvdXNTRzFoMiIsImlhdCI6MTc2NDIwOTE0OSwiZXhwIjoxNzY0MjEyNzQ5LCJlbWFpbCI6InRlc3RAdm9sYWJhcmF0by5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEB2b2xhYmFyYXRvLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.MY3IQ6PIXssfED9W378k5KXItZ4CcEUXg1gvSeVYXO7kJlyBaUCKt30xga4yZ3ftYXpdHhIdlKDrwSW2y9FGeRTpZAmbA3tzmkvT_GlEZ0avgFQK8JRmtFQDsW1uA9e22KOy4DfL-2ZVz5cAxPXbfGAKShCJz2ndaUklQtkJkka-aXejS1aYNbtU1Xat2bXm3qE2plLt5GTDZEQELmpsQUbFaS_dC4tK9xVwP8LIAvA-VYwxSTeQwsZ5SFD8NwNfyWsloi5ros1SEwraaT0xLnAL-IQw0Jrtmprh88ju2uInjQm_Mr2LOKCm9jVUWXgIxcWspgQ0vRhERWI63BDCQg
   ```
   - **⚠️ IMPORTANTE:** Debe empezar con `Bearer ` (con espacio después de "Bearer")
   - **NO** debe ser: `bearer`, `Bearer` (sin espacio), `Bearer  ` (con espacios extra), etc.

### Paso 3: Verificar que el Header Esté Habilitado

1. Asegúrate de que haya un **checkbox** al lado del header
2. El checkbox debe estar **marcado** (habilitado) ☑
3. Si el checkbox está desmarcado, haz clic en él para habilitarlo

### Paso 4: Verificar el Formato Completo

Tu header debe verse así:

```
┌─────────────────────────────────────────────────────────┐
│ Headers                                                  │
├─────────────────────────────────────────────────────────┤
│ Key                    │ Value                          │
├─────────────────────────────────────────────────────────┤
│ Authorization ☑        │ Bearer eyJhbGciOiJSUzI1NiIs... │
└─────────────────────────────────────────────────────────┘
```

**Formato correcto:**
- Key: `Authorization` (exactamente así, sin espacios)
- Value: `Bearer <token>` (con espacio después de "Bearer")
- Checkbox: ☑ Marcado (habilitado)

---

## 🔍 Verificación Visual en Postman

Tu configuración debe verse así:

```
┌─────────────────────────────────────────────────────────┐
│ GET  https://backup-volabarato-1.onrender.com/api/...   │
├─────────────────────────────────────────────────────────┤
│ Params | Authorization | Headers | Body | Pre-request │
├─────────────────────────────────────────────────────────┤
│ Headers:                                                │
│                                                         │
│ ☑ Authorization  │  Bearer eyJhbGciOiJSUzI1NiIs...     │
│                                                         │
│ [Add Header]                                            │
└─────────────────────────────────────────────────────────┘
```

---

## 🚨 Errores Comunes

### ❌ Error 1: Header en minúsculas
- **Mal:** `authorization`
- **Bien:** `Authorization` (con A mayúscula)

### ❌ Error 2: Falta "Bearer"
- **Mal:** `eyJhbGciOiJSUzI1NiIs...` (solo el token)
- **Bien:** `Bearer eyJhbGciOiJSUzI1NiIs...` (con "Bearer " al inicio)

### ❌ Error 3: Sin espacio después de "Bearer"
- **Mal:** `BearereyJhbGciOiJSUzI1NiIs...` (sin espacio)
- **Bien:** `Bearer eyJhbGciOiJSUzI1NiIs...` (con espacio)

### ❌ Error 4: Header deshabilitado
- **Mal:** Checkbox desmarcado ☐
- **Bien:** Checkbox marcado ☑ (habilitado)

### ❌ Error 5: Header en la pestaña incorrecta
- **Mal:** Header en "Body" o "Params"
- **Bien:** Header en la pestaña "Headers"

### ❌ Error 6: Espacios extra
- **Mal:** `Authorization ` (con espacio al final)
- **Mal:** `Bearer  eyJhbGciOiJSUzI1NiIs...` (dos espacios)
- **Bien:** `Authorization` (sin espacios extra)
- **Bien:** `Bearer eyJhbGciOiJSUzI1NiIs...` (un solo espacio)

---

## ✅ Formato Correcto del Header

```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ1YTZjMGMyYjgwMDcxN2EzNGQ1Y2JiYmYzOWI4NGI2NzYxMjgyNjUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdm9sYWJhcmF0by1jOGM1YSIsImF1ZCI6InZvbGFiYXJhdG8tYzhjNWEiLCJhdXRoX3RpbWUiOjE3NjQyMDkxNDksInVzZXJfaWQiOiJYdW1JakwwN1JRUlJVREhWZzZ5Y291c1NHMWgyIiwic3ViIjoiWHVtSWpMMDdSUVJSVURIVmc2eWNvdXNTRzFoMiIsImlhdCI6MTc2NDIwOTE0OSwiZXhwIjoxNzY0MjEyNzQ5LCJlbWFpbCI6InRlc3RAdm9sYWJhcmF0by5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEB2b2xhYmFyYXRvLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.MY3IQ6PIXssfED9W378k5KXItZ4CcEUXg1gvSeVYXO7kJlyBaUCKt30xga4yZ3ftYXpdHhIdlKDrwSW2y9FGeRTpZAmbA3tzmkvT_GlEZ0avgFQK8JRmtFQDsW1uA9e22KOy4DfL-2ZVz5cAxPXbfGAKShCJz2ndaUklQtkJkka-aXejS1aYNbtU1Xat2bXm3qE2plLt5GTDZEQELmpsQUbFaS_dC4tK9xVwP8LIAvA-VYwxSTeQwsZ5SFD8NwNfyWsloi5ros1SEwraaT0xLnAL-IQw0Jrtmprh88ju2uInjQm_Mr2LOKCm9jVUWXgIxcWspgQ0vRhERWI63BDCQg
```

**Desglose:**
- `Authorization` (nombre del header)
- `:` (dos puntos)
- ` ` (un espacio)
- `Bearer` (palabra "Bearer")
- ` ` (un espacio)
- `eyJhbGciOiJSUzI1NiIs...` (el token completo)

---

## 🔧 Pasos Detallados en Postman

### 1. Abre Postman y crea un nuevo request

### 2. Configura el método y URL
- Método: **GET**
- URL: `https://backup-volabarato-1.onrender.com/api/firebase/profile`

### 3. Ve a la pestaña "Headers"

### 4. Agrega el header:
   - **Key:** `Authorization`
   - **Value:** `Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ1YTZjMGMyYjgwMDcxN2EzNGQ1Y2JiYmYzOWI4NGI2NzYxMjgyNjUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdm9sYWJhcmF0by1jOGM1YSIsImF1ZCI6InZvbGFiYXJhdG8tYzhjNWEiLCJhdXRoX3RpbWUiOjE3NjQyMDkxNDksInVzZXJfaWQiOiJYdW1JakwwN1JRUlJVREhWZzZ5Y291c1NHMWgyIiwic3ViIjoiWHVtSWpMMDdSUVJSVURIVmc2eWNvdXNTRzFoMiIsImlhdCI6MTc2NDIwOTE0OSwiZXhwIjoxNzY0MjEyNzQ5LCJlbWFpbCI6InRlc3RAdm9sYWJhcmF0by5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEB2b2xhYmFyYXRvLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.MY3IQ6PIXssfED9W378k5KXItZ4CcEUXg1gvSeVYXO7kJlyBaUCKt30xga4yZ3ftYXpdHhIdlKDrwSW2y9FGeRTpZAmbA3tzmkvT_GlEZ0avgFQK8JRmtFQDsW1uA9e22KOy4DfL-2ZVz5cAxPXbfGAKShCJz2ndaUklQtkJkka-aXejS1aYNbtU1Xat2bXm3qE2plLt5GTDZEQELmpsQUbFaS_dC4tK9xVwP8LIAvA-VYwxSTeQwsZ5SFD8NwNfyWsloi5ros1SEwraaT0xLnAL-IQw0Jrtmprh88ju2uInjQm_Mr2LOKCm9jVUWXgIxcWspgQ0vRhERWI63BDCQg`
   - **Checkbox:** ☑ Debe estar marcado (habilitado)

### 5. Envía el request

---

## ✅ Verificación

Antes de enviar, verifica:

- [ ] Estás en la pestaña **"Headers"** (no "Body" o "Params")
- [ ] El Key es exactamente `Authorization` (con A mayúscula)
- [ ] El Value empieza con `Bearer ` (con espacio después)
- [ ] El checkbox está marcado ☑ (habilitado)
- [ ] No hay espacios extra en el Key o Value
- [ ] El token completo está incluido (es muy largo)

---

## 🎯 Si Sigue Dando Error

### Opción 1: Verificar en la Consola de Postman

1. Después de enviar el request, ve a la pestaña **"Console"** (abajo en Postman)
2. Busca la sección **"Request Headers"**
3. Verifica que aparezca:
   ```
   Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
   ```

### Opción 2: Copiar y Pegar Directamente

1. Elimina el header actual
2. Haz clic en **"Add Header"**
3. Copia y pega esto exactamente en el campo **Key**:
   ```
   Authorization
   ```
4. Copia y pega esto exactamente en el campo **Value**:
   ```
   Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ1YTZjMGMyYjgwMDcxN2EzNGQ1Y2JiYmYzOWI4NGI2NzYxMjgyNjUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdm9sYWJhcmF0by1jOGM1YSIsImF1ZCI6InZvbGFiYXJhdG8tYzhjNWEiLCJhdXRoX3RpbWUiOjE3NjQyMDkxNDksInVzZXJfaWQiOiJYdW1JakwwN1JRUlJVREhWZzZ5Y291c1NHMWgyIiwic3ViIjoiWHVtSWpMMDdSUVJSVURIVmc2eWNvdXNTRzFoMiIsImlhdCI6MTc2NDIwOTE0OSwiZXhwIjoxNzY0MjEyNzQ5LCJlbWFpbCI6InRlc3RAdm9sYWJhcmF0by5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEB2b2xhYmFyYXRvLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.MY3IQ6PIXssfED9W378k5KXItZ4CcEUXg1gvSeVYXO7kJlyBaUCKt30xga4yZ3ftYXpdHhIdlKDrwSW2y9FGeRTpZAmbA3tzmkvT_GlEZ0avgFQK8JRmtFQDsW1uA9e22KOy4DfL-2ZVz5cAxPXbfGAKShCJz2ndaUklQtkJkka-aXejS1aYNbtU1Xat2bXm3qE2plLt5GTDZEQELmpsQUbFaS_dC4tK9xVwP8LIAvA-VYwxSTeQwsZ5SFD8NwNfyWsloi5ros1SEwraaT0xLnAL-IQw0Jrtmprh88ju2uInjQm_Mr2LOKCm9jVUWXgIxcWspgQ0vRhERWI63BDCQg
   ```
5. Asegúrate de que el checkbox esté marcado ☑

---

## ✅ Resultado Esperado

Si todo está correcto, deberías recibir:

```json
{
  "message": "Firebase Auth OK",
  "user": {
    "uid": "XumIjL07RQRRUDHVg6ycousSG1h2",
    "email": "test@volabarato.com",
    "email_verified": false,
    ...
  }
}
```

---

¿Puedes verificar estos puntos y probar de nuevo? El problema más común es que el header no esté habilitado (checkbox desmarcado) o que falte "Bearer " al inicio del Value.

