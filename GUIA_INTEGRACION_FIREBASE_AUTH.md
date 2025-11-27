# 🔥 Guía de Integración: Firebase Authentication en VolaBarato

## 📋 Tabla de Contenidos

1. [Resumen de la Integración](#resumen-de-la-integración)
2. [Backend: Usar Firebase Auth en Endpoints](#backend-usar-firebase-auth-en-endpoints)
3. [Backend: Vincular Usuarios Firebase con MongoDB](#backend-vincular-usuarios-firebase-con-mongodb)
4. [Frontend: Integrar Firebase SDK](#frontend-integrar-firebase-sdk)
5. [Frontend: Enviar Tokens al Backend](#frontend-enviar-tokens-al-backend)
6. [Combinar JWT y Firebase Auth](#combinar-jwt-y-firebase-auth)
7. [Ejemplos de Uso](#ejemplos-de-uso)

---

## Resumen de la Integración

### ✅ Lo que está implementado:

1. **Firebase Admin SDK** configurado en el backend
2. **Middleware `firebaseAuth`** para proteger rutas con Firebase
3. **Middleware `dualAuth`** que permite JWT o Firebase Auth
4. **Helpers** para vincular usuarios de Firebase con MongoDB
5. **Endpoints** para vincular y obtener usuarios vinculados

### 📁 Archivos Creados:

- `src/middlewares/firebaseAuth.ts` - Middleware de autenticación Firebase
- `src/middlewares/dualAuth.ts` - Middleware que acepta JWT o Firebase
- `src/helpers/firebaseUserHelper.ts` - Helpers para vincular usuarios
- `src/controllers/firebaseUser.controllers.ts` - Controladores para usuarios Firebase
- `src/models/user.models.ts` - Actualizado con campo `firebaseUid`

---

## Backend: Usar Firebase Auth en Endpoints

### Opción 1: Usar solo Firebase Auth

```typescript
import { Router } from 'express';
import { firebaseAuth } from '../middlewares/firebaseAuth.js';
import { myController } from '../controllers/my.controller.js';

const router = Router();

// Proteger ruta con Firebase Auth
router.get('/mi-ruta', firebaseAuth, myController);

// Acceder a información del usuario en el controller
export const myController = async (req: Request, res: Response) => {
  // req.firebaseUser contiene:
  // - uid: string
  // - email?: string
  // - email_verified?: boolean
  // - ...otros campos de Firebase
  
  const userId = req.firebaseUser?.uid;
  const userEmail = req.firebaseUser?.email;
  
  res.json({ message: 'Ruta protegida', userId, userEmail });
};
```

### Opción 2: Usar Dual Auth (JWT o Firebase)

```typescript
import { Router } from 'express';
import { dualAuth } from '../middlewares/dualAuth.js';
import { myController } from '../controllers/my.controller.js';

const router = Router();

// Proteger ruta que acepta JWT o Firebase
router.get('/mi-ruta', dualAuth, myController);

// En el controller, verificar qué tipo de auth se usó
export const myController = async (req: Request, res: Response) => {
  // Si viene de JWT
  if (req.user) {
    const userId = req.user._id;
    const username = req.user.usuario;
    // ... lógica con JWT
  }
  
  // Si viene de Firebase
  if (req.firebaseUser) {
    const firebaseUid = req.firebaseUser.uid;
    const email = req.firebaseUser.email;
    // ... lógica con Firebase
  }
};
```

### Ejemplo Real: Rutas de Reserva

```typescript
// src/routes/reserva.routes.ts
import { dualAuth } from '../middlewares/dualAuth.js';

// Crear reserva (acepta JWT o Firebase)
router.post('/', dualAuth, createReserva);

// Obtener mis reservas (acepta JWT o Firebase)
router.get('/mis-reservas', dualAuth, getMisReservas);
```

---

## Backend: Vincular Usuarios Firebase con MongoDB

### Paso 1: Obtener Usuario Vinculado

```typescript
import { getUserFromRequest } from '../helpers/firebaseUserHelper.js';

export const myController = async (req: Request, res: Response) => {
  // Obtener usuario de MongoDB (busca por JWT o Firebase)
  const user = await getUserFromRequest(req);
  
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  
  // Usar el usuario de MongoDB
  const userId = user._id;
  // ... tu lógica aquí
};
```

### Paso 2: Endpoints para Vincular Usuarios

#### GET `/api/firebase/user`
Obtiene el usuario de MongoDB vinculado con el UID de Firebase actual.

**Headers:**
```
Authorization: Bearer <firebase_token>
```

**Respuesta:**
```json
{
  "message": "Usuario encontrado",
  "user": {
    "_id": "...",
    "usuario": "johndoe",
    "email": "john@example.com",
    "nombreLegal": "John Doe",
    "rol": "cliente",
    "firebaseUid": "XumIjL07RQRRUDHVg6ycousSG1h2"
  }
}
```

#### POST `/api/firebase/link-user`
Vincula un usuario de Firebase con un usuario existente en MongoDB.

**Headers:**
```
Authorization: Bearer <firebase_token>
```

**Body:**
```json
{
  "email": "john@example.com"
}
```

**Respuesta:**
```json
{
  "message": "Usuario vinculado exitosamente",
  "user": {
    "_id": "...",
    "usuario": "johndoe",
    "email": "john@example.com",
    "firebaseUid": "XumIjL07RQRRUDHVg6ycousSG1h2"
  }
}
```

### Paso 3: Buscar o Crear Usuario

```typescript
import { findOrCreateUserByFirebaseUid } from '../helpers/firebaseUserHelper.js';

// Buscar usuario por Firebase UID
const user = await findOrCreateUserByFirebaseUid(
  firebaseUid,
  firebaseEmail
);

if (!user) {
  // Usuario no existe, crear uno nuevo
  // ...
}
```

---

## Frontend: Integrar Firebase SDK

### Paso 1: Instalar Firebase SDK

```bash
npm install firebase
```

### Paso 2: Configurar Firebase en el Frontend

```typescript
// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD9rzm1vj6tLXbcEJqJ3TIvG1ZbNoPaH2A",
  authDomain: "volabarato-c8c5a.firebaseapp.com",
  projectId: "volabarato-c8c5a",
  // ... otros campos de tu configuración
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### Paso 3: Autenticación con Email y Contraseña

```typescript
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './config/firebase';

// Iniciar sesión
const loginWithFirebase = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    
    // Guardar token
    localStorage.setItem('firebase_token', idToken);
    
    return { success: true, token: idToken };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Registrar usuario
const registerWithFirebase = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    
    localStorage.setItem('firebase_token', idToken);
    
    return { success: true, token: idToken };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
```

---

## Frontend: Enviar Tokens al Backend

### Opción 1: Interceptor de Axios

```typescript
// src/utils/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backup-volabarato-1.onrender.com/api',
});

// Interceptor para agregar token de Firebase
api.interceptors.request.use((config) => {
  const firebaseToken = localStorage.getItem('firebase_token');
  
  if (firebaseToken) {
    config.headers.Authorization = `Bearer ${firebaseToken}`;
  }
  
  return config;
});

export default api;
```

### Opción 2: Función Helper

```typescript
// src/utils/api.ts
import axios from 'axios';

const API_BASE_URL = 'https://backup-volabarato-1.onrender.com/api';

export const apiRequest = async (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any
) => {
  const firebaseToken = localStorage.getItem('firebase_token');
  
  const config = {
    method,
    url: `${API_BASE_URL}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      ...(firebaseToken && { Authorization: `Bearer ${firebaseToken}` }),
    },
    ...(data && { data }),
  };
  
  return axios(config);
};

// Uso
const response = await apiRequest('GET', '/reserva/mis-reservas');
```

### Opción 3: Renovar Token Automáticamente

```typescript
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';

// Escuchar cambios de autenticación
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Obtener token actualizado
    const idToken = await user.getIdToken();
    localStorage.setItem('firebase_token', idToken);
  } else {
    // Usuario cerró sesión
    localStorage.removeItem('firebase_token');
  }
});

// Renovar token periódicamente (cada hora)
setInterval(async () => {
  const user = auth.currentUser;
  if (user) {
    const idToken = await user.getIdToken(true); // true = forzar renovación
    localStorage.setItem('firebase_token', idToken);
  }
}, 3600000); // 1 hora
```

---

## Combinar JWT y Firebase Auth

### Estrategia Recomendada

1. **Usuarios nuevos**: Usar Firebase Auth
2. **Usuarios existentes**: Pueden seguir usando JWT o migrar a Firebase
3. **Backend**: Usar `dualAuth` para aceptar ambos

### Ejemplo: Migración Gradual

```typescript
// Permitir ambos métodos de autenticación
router.post('/reserva', dualAuth, createReserva);

// En el controller
export const createReserva = async (req: Request, res: Response) => {
  let userId: string;
  
  // Si viene de JWT
  if (req.user) {
    userId = req.user._id;
  }
  // Si viene de Firebase
  else if (req.firebaseUser) {
    // Buscar usuario en MongoDB por firebaseUid
    const user = await findOrCreateUserByFirebaseUid(
      req.firebaseUser.uid,
      req.firebaseUser.email
    );
    userId = user?._id.toString();
  }
  else {
    return res.status(401).json({ error: 'No autenticado' });
  }
  
  // Crear reserva con userId
  // ...
};
```

---

## Ejemplos de Uso

### Ejemplo 1: Crear Reserva con Firebase

```typescript
// Frontend
const createReserva = async (reservaData: any) => {
  const firebaseToken = localStorage.getItem('firebase_token');
  
  const response = await fetch('https://backup-volabarato-1.onrender.com/api/reserva', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${firebaseToken}`
    },
    body: JSON.stringify(reservaData)
  });
  
  return response.json();
};
```

### Ejemplo 2: Vincular Usuario Firebase con MongoDB

```typescript
// Frontend
const linkUser = async (email: string) => {
  const firebaseToken = localStorage.getItem('firebase_token');
  
  const response = await fetch('https://backup-volabarato-1.onrender.com/api/firebase/link-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${firebaseToken}`
    },
    body: JSON.stringify({ email })
  });
  
  return response.json();
};
```

### Ejemplo 3: Obtener Usuario Vinculado

```typescript
// Frontend
const getLinkedUser = async () => {
  const firebaseToken = localStorage.getItem('firebase_token');
  
  const response = await fetch('https://backup-volabarato-1.onrender.com/api/firebase/user', {
    headers: {
      'Authorization': `Bearer ${firebaseToken}`
    }
  });
  
  return response.json();
};
```

---

## 📝 Resumen de Endpoints

### Firebase Auth

- `GET /api/firebase/status` - Verificar estado de Firebase (público)
- `GET /api/firebase/profile` - Obtener perfil Firebase (protegido)
- `GET /api/firebase/user` - Obtener usuario MongoDB vinculado (protegido)
- `POST /api/firebase/link-user` - Vincular usuario Firebase con MongoDB (protegido)

### Reservas (con Dual Auth)

- `POST /api/reserva` - Crear reserva (JWT o Firebase)
- `GET /api/reserva/mis-reservas` - Mis reservas (JWT o Firebase)
- `PUT /api/reserva/:id` - Actualizar reserva (JWT o Firebase)
- `DELETE /api/reserva/:id` - Eliminar reserva (JWT o Firebase)

---

## ✅ Checklist de Integración

### Backend
- [x] Firebase Admin SDK configurado
- [x] Middleware `firebaseAuth` creado
- [x] Middleware `dualAuth` creado
- [x] Helpers para vincular usuarios creados
- [x] Endpoints para vincular usuarios creados
- [x] Modelo de usuario actualizado con `firebaseUid`

### Frontend (Pendiente)
- [ ] Instalar Firebase SDK
- [ ] Configurar Firebase en el frontend
- [ ] Implementar autenticación con Firebase
- [ ] Agregar interceptor para enviar tokens
- [ ] Implementar renovación automática de tokens

---

¿Necesitas ayuda con algún paso específico?

