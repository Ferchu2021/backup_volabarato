# 🔥 Implementación de Firebase - Paso a Paso

## 📋 ¿Qué parte de Firebase quieres integrar?

Firebase ofrece varios servicios. Para VolaBarato, las opciones más útiles son:

1. **Firebase Hosting** - Para desplegar el frontend (alternativa a Vercel)
2. **Firebase Storage** - Para almacenar imágenes de paquetes
3. **Firebase Authentication** - Como alternativa o complemento a JWT
4. **Firebase Firestore** - Base de datos (aunque ya tienes MongoDB)

**Recomendación**: Empezar con **Firebase Storage** (para imágenes) y **Firebase Hosting** (para el frontend).

---

## 🚀 OPCIÓN 1: Firebase Storage (Para Imágenes)

### Paso 1: Crear Proyecto en Firebase

1. Ve a https://console.firebase.google.com/
2. Haz clic en **"Add project"** o **"Crear proyecto"**
3. Ingresa el nombre: `volabarato` (o el que prefieras)
4. Desactiva Google Analytics (opcional, para simplificar)
5. Haz clic en **"Create project"**
6. Espera a que se cree el proyecto

### Paso 2: Habilitar Firebase Storage

1. En el menú lateral, haz clic en **"Storage"**
2. Haz clic en **"Get started"**
3. Selecciona **"Start in test mode"** (por ahora, luego ajustaremos las reglas)
4. Selecciona la ubicación del bucket (elige la más cercana a tus usuarios)
5. Haz clic en **"Done"**

### Paso 3: Configurar Reglas de Seguridad

1. En Storage, ve a la pestaña **"Rules"**
2. Reemplaza las reglas con:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir lectura pública de imágenes
    match /paquetes/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null; // Solo usuarios autenticados pueden escribir
    }
    
    // Permitir lectura pública, escritura solo autenticada
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Haz clic en **"Publish"**

### Paso 4: Obtener Configuración de Firebase

1. En Firebase Console, haz clic en el ícono de engranaje ⚙️ → **"Project settings"**
2. Baja hasta **"Your apps"**
3. Haz clic en el ícono de web `</>`
4. Ingresa un nombre para la app: `VolaBarato Frontend`
5. **NO marques** "Also set up Firebase Hosting" (por ahora)
6. Haz clic en **"Register app"**
7. **Copia** la configuración que aparece (firebaseConfig)

Se verá así:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "volabarato.firebaseapp.com",
  projectId: "volabarato",
  storageBucket: "volabarato.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### Paso 5: Instalar Firebase SDK en el Frontend

```bash
cd volabarato_frontend
npm install firebase
```

### Paso 6: Crear Archivo de Configuración de Firebase

Crea el archivo: `volabarato_frontend/src/config/firebase.ts`

```typescript
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Tu configuración de Firebase (reemplaza con tus valores)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Storage
export const storage = getStorage(app);

export default app;
```

### Paso 7: Crear Servicio para Subir Imágenes

Crea el archivo: `volabarato_frontend/src/services/firebaseStorage.ts`

```typescript
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Sube una imagen a Firebase Storage
 * @param file - Archivo de imagen
 * @param folder - Carpeta donde guardar (ej: 'paquetes', 'usuarios')
 * @returns URL de la imagen subida
 */
export const uploadImage = async (
  file: File,
  folder: string = 'paquetes'
): Promise<string> => {
  try {
    // Crear referencia única para el archivo
    const timestamp = Date.now();
    const fileName = `${folder}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);

    // Subir el archivo
    await uploadBytes(storageRef, file);

    // Obtener la URL de descarga
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error al subir imagen:', error);
    throw new Error('Error al subir la imagen');
  }
};

/**
 * Elimina una imagen de Firebase Storage
 * @param imageUrl - URL de la imagen a eliminar
 */
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extraer la ruta del archivo de la URL
    const url = new URL(imageUrl);
    const path = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0]);
    const imageRef = ref(storage, path);

    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    throw new Error('Error al eliminar la imagen');
  }
};
```

### Paso 8: Actualizar Componente de Subida de Imágenes

Si tienes un componente para subir imágenes, actualízalo para usar Firebase Storage.

Ejemplo en un componente:
```typescript
import { uploadImage } from '../services/firebaseStorage';

const handleImageUpload = async (file: File) => {
  try {
    const imageUrl = await uploadImage(file, 'paquetes');
    // Usar imageUrl en tu formulario
    console.log('Imagen subida:', imageUrl);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 🌐 OPCIÓN 2: Firebase Hosting (Para Frontend)

### Paso 1: Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### Paso 2: Iniciar Sesión en Firebase

```bash
firebase login
```

Esto abrirá tu navegador para autenticarte.

### Paso 3: Inicializar Firebase en el Proyecto

```bash
cd volabarato_frontend
firebase init hosting
```

Sigue las preguntas:
1. **"What do you want to use as your public directory?"** → `dist` (o `build` si usas otro)
2. **"Configure as a single-page app?"** → `Yes`
3. **"Set up automatic builds and deploys with GitHub?"** → `No` (por ahora)
4. **"File dist/index.html already exists. Overwrite?"** → `No`

### Paso 4: Configurar firebase.json

El archivo `firebase.json` se creará automáticamente. Debería verse así:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Paso 5: Configurar .firebaserc

El archivo `.firebaserc` también se creará. Debería verse así:

```json
{
  "projects": {
    "default": "volabarato"
  }
}
```

Reemplaza `volabarato` con el ID de tu proyecto de Firebase.

### Paso 6: Build del Frontend

```bash
npm run build
```

### Paso 7: Deploy a Firebase Hosting

```bash
firebase deploy --only hosting
```

### Paso 8: Verificar Deployment

Firebase te dará una URL como: `https://volabarato.web.app` o `https://volabarato.firebaseapp.com`

---

## 🔐 OPCIÓN 3: Firebase Authentication (Opcional)

Si quieres agregar Firebase Auth como alternativa a JWT:

### Paso 1: Habilitar Firebase Authentication

1. En Firebase Console → **Authentication**
2. Haz clic en **"Get started"**
3. Habilita **"Email/Password"** (y otros proveedores si quieres)

### Paso 2: Instalar SDK en Frontend

```bash
npm install firebase
```

### Paso 3: Configurar Firebase Auth

En `src/config/firebase.ts`, agrega:

```typescript
import { getAuth } from 'firebase/auth';

export const auth = getAuth(app);
```

### Paso 4: Crear Servicio de Autenticación

Crea `src/services/firebaseAuth.ts`:

```typescript
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase';

export const loginWithFirebase = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const registerWithFirebase = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const logoutFirebase = async () => {
  return await signOut(auth);
};
```

---

## 📝 Checklist de Implementación

### Firebase Storage
- [ ] Proyecto creado en Firebase Console
- [ ] Storage habilitado
- [ ] Reglas de seguridad configuradas
- [ ] Firebase SDK instalado (`npm install firebase`)
- [ ] Archivo de configuración creado (`src/config/firebase.ts`)
- [ ] Servicio de Storage creado (`src/services/firebaseStorage.ts`)
- [ ] Componentes actualizados para usar Firebase Storage
- [ ] Probado subida de imágenes

### Firebase Hosting
- [ ] Firebase CLI instalado
- [ ] Iniciado sesión (`firebase login`)
- [ ] Firebase inicializado (`firebase init hosting`)
- [ ] `firebase.json` configurado
- [ ] `.firebaserc` configurado
- [ ] Build del frontend (`npm run build`)
- [ ] Deploy realizado (`firebase deploy --only hosting`)
- [ ] URL de Firebase Hosting funcionando

### Firebase Authentication (Opcional)
- [ ] Authentication habilitado en Firebase Console
- [ ] Proveedores configurados (Email/Password, etc.)
- [ ] Servicio de Auth creado
- [ ] Componentes de login/registro actualizados
- [ ] Integración con backend (si es necesario)

---

## 🔧 Variables de Entorno

Si usas Firebase, agrega estas variables a tu `.env` (frontend):

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

Y actualiza `firebase.ts` para usar variables de entorno:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

---

## 🎯 Recomendación de Orden de Implementación

1. **Primero**: Firebase Storage (para imágenes)
2. **Segundo**: Firebase Hosting (para deployment)
3. **Tercero**: Firebase Authentication (si se requiere)

---

## 📚 Recursos

- **Firebase Console**: https://console.firebase.google.com/
- **Documentación Firebase**: https://firebase.google.com/docs
- **Firebase Storage**: https://firebase.google.com/docs/storage
- **Firebase Hosting**: https://firebase.google.com/docs/hosting

---

¿Con cuál opción quieres empezar? Te puedo guiar paso a paso.

