# 🔑 Cómo Obtener el API Key de Firebase

## 📋 Paso 1: Crear App Web en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **volabarato** (ID: volabarato-c8c5a)
3. Haz clic en el **icono de engranaje** ⚙️ (arriba a la izquierda)
4. Selecciona **"Configuración del proyecto"**
5. Baja hasta la sección **"Tus apps"** (Your apps)
6. Haz clic en el icono **`</>`** (Agregar app web / Add web app)
7. Ingresa un nombre: `VolaBarato Web` (o el que prefieras)
8. **NO marques** la casilla "También configura Firebase Hosting" (por ahora)
9. Haz clic en **"Registrar app"**

---

## 📋 Paso 2: Copiar el API Key

Después de registrar la app, Firebase mostrará un objeto de configuración como este:

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

### ✅ El API Key que necesitas copiar es:

**`apiKey`** - Es el valor que empieza con `AIzaSy...`

**Ejemplo:**
```
AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 📝 ¿Para qué sirve el API Key?

El `apiKey` lo necesitarás para:

1. **Obtener tokens de Firebase desde Postman** usando la API REST de Firebase
2. **Autenticar usuarios** desde el frontend (cuando lo implementes)
3. **Hacer peticiones a Firebase Authentication REST API**

---

## 🔍 ¿Dónde está el API Key si ya creé la app?

Si ya creaste la app web anteriormente:

1. Ve a **Firebase Console** → Tu proyecto
2. **Configuración del proyecto** (icono ⚙️)
3. Baja hasta **"Tus apps"**
4. Busca tu app web (debería aparecer con el nombre que le diste)
5. Haz clic en el icono de **configuración** ⚙️ o en el nombre de la app
6. Verás el objeto de configuración con el `apiKey`

---

## ⚠️ IMPORTANTE

- El `apiKey` es **público** y está diseñado para usarse en el frontend
- **NO es una credencial secreta** como el `FIREBASE_PRIVATE_KEY`
- Es seguro compartirlo en el código del frontend
- Se usa para identificar tu proyecto de Firebase

---

## 📋 Resumen

**API Key a copiar:**
```
AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Dónde encontrarlo:**
- Firebase Console → Configuración del proyecto → Tus apps → Tu app web → Configuración

---

¿Ya tienes el API Key? ¡Perfecto! Ahora puedes usarlo para obtener tokens de Firebase desde Postman.

