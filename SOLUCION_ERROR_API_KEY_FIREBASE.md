# 🔧 Solución: Error "API key not valid" en Firebase

## 🔍 Diagnóstico

El error `API key not valid` significa que:
1. El API key no está habilitado para Identity Toolkit API, o
2. Hay restricciones en el API key que bloquean el acceso

---

## ✅ Solución Paso a Paso

### Paso 1: Verificar el API Key

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **volabarato** (ID: volabarato-c8c5a)
3. **Configuración del proyecto** (icono ⚙️)
4. Pestaña **"General"**
5. Baja hasta **"Tus apps"** → Tu app web **"VolaBarato Frontend"**
6. Verifica que el `apiKey` sea: `AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A`

---

### Paso 2: Habilitar Identity Toolkit API en Google Cloud

El API key necesita tener habilitada la **Identity Toolkit API**. Sigue estos pasos:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona el proyecto: **volabarato-c8c5a**
3. En el menú lateral, ve a **"APIs & Services"** → **"Library"** (o **"APIs y servicios"** → **"Biblioteca"**)
4. Busca: **"Identity Toolkit API"**
5. Haz clic en el resultado
6. Haz clic en **"Enable"** (Habilitar)

**Alternativa más rápida:**
- Ve directamente a: https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com?project=volabarato-c8c5a
- Haz clic en **"Enable"** (Habilitar)

---

### Paso 3: Verificar Restricciones del API Key (Opcional)

Si el API key tiene restricciones, necesitas verificar que permita Identity Toolkit:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials** (Credenciales)
3. Busca tu API key: `AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A`
4. Haz clic en el API key
5. Verifica la sección **"API restrictions"**:
   - Si está en **"Don't restrict key"**: Está bien, no hay restricciones
   - Si está en **"Restrict key"**: Asegúrate de que **"Identity Toolkit API"** esté en la lista de APIs permitidas

---

### Paso 4: Esperar unos minutos

Después de habilitar la API, espera 1-2 minutos para que los cambios se propaguen.

---

### Paso 5: Probar de nuevo

Intenta el request de nuevo:

```
POST https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A
```

**Body:**
```json
{
  "email": "test@volabarato.com",
  "password": "12345678",
  "returnSecureToken": true
}
```

---

## 🔍 Verificación Rápida

### ¿La API está habilitada?

1. Ve a: https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com?project=volabarato-c8c5a
2. Deberías ver: **"API enabled"** (API habilitada) en verde

Si dice **"Enable"** (Habilitar), haz clic ahí.

---

## ⚠️ Nota Importante

- El API key es público y está diseñado para usarse en el frontend
- Habilitar Identity Toolkit API es necesario para usar Firebase Authentication REST API
- No hay costo adicional por habilitar esta API en el plan gratuito de Firebase

---

## ✅ Checklist

- [ ] Verifiqué que el API key es correcto: `AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A`
- [ ] Habilité Identity Toolkit API en Google Cloud Console
- [ ] Esperé 1-2 minutos después de habilitar
- [ ] Probé el request de nuevo

---

¿Ya habilitaste Identity Toolkit API? Si sí, prueba el request de nuevo y dime qué resultado obtienes.

