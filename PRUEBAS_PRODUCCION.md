# 🧪 Guía de Pruebas en Producción - VolaBarato

## 🔗 URLs de Producción

- **Frontend**: https://frontend-volabarato.vercel.app/
- **Backend**: https://backup-volabarato-1.onrender.com/api

---

## ✅ Checklist de Verificación Inicial

### 1. Verificar que los Servicios Estén Activos

#### Frontend (Vercel)
- [ ] Abrir https://frontend-volabarato.vercel.app/
- [ ] Verificar que la página carga sin errores
- [ ] Abrir la consola del navegador (F12) y verificar que no hay errores críticos
- [ ] Verificar que se muestran los paquetes en la página principal

#### Backend (Render)
- [ ] Abrir https://backup-volabarato-1.onrender.com/
- [ ] Debería mostrar: `{"message":"🚀 Backend VolaBarato API","version":"1.0.0","status":"running"}`
- [ ] Probar endpoint de paquetes: https://backup-volabarato-1.onrender.com/api/paquete
- [ ] Debería retornar un array de paquetes JSON

---

## 🔐 Pruebas de Autenticación

### 1. Registro de Usuario
**URL**: https://frontend-volabarato.vercel.app/registro

**Pasos**:
1. Ir a la página de registro
2. Completar todos los campos:
   - Usuario: `testuser123` (mínimo 4 caracteres)
   - Contraseña: `testpass123` (mínimo 6 caracteres)
   - Nombre Legal: `Juan Pérez`
   - Fecha de Nacimiento: `1990-01-15`
   - Nacionalidad: `Argentina`
   - DNI: `12345678`
   - CUIL/CUIT: (opcional, dejar vacío)
   - Número de Pasaporte: `AB123456`
   - Teléfono: `+54 9 341 1234567`
   - Teléfono de Contacto: `+54 9 341 1234567`
   - Email: `test@example.com`
3. Hacer clic en "Registrarse"
4. **Resultado esperado**: 
   - Redirección a la página de login
   - Mensaje de éxito: "Cuenta creada exitosamente. Por favor inicia sesión."

**Verificar en Consola del Navegador**:
- No debe haber errores de CORS
- No debe haber errores 400 o 500
- La petición POST a `/api/user/register` debe retornar 201 o 200

**Verificar en Logs de Render**:
- Debe aparecer `=== REGISTER USER DEBUG ===`
- No debe haber errores de validación

### 2. Login
**URL**: https://frontend-volabarato.vercel.app/login

**Pasos**:
1. Ingresar usuario: `testuser123`
2. Ingresar contraseña: `testpass123`
3. Hacer clic en "Iniciar Sesión"
4. **Resultado esperado**: 
   - Si es admin → redirección a `/admin`
   - Si es cliente → redirección a `/`

**Verificar**:
- Token almacenado en localStorage (verificar en DevTools → Application → Local Storage)
- Usuario autenticado en Redux state
- Navbar muestra opciones según rol

### 3. Verificar Token de Autenticación
**En Consola del Navegador**:
```javascript
localStorage.getItem('token')
```
- Debe retornar un string JWT (comienza con `eyJ...`)

---

## 🎫 Pruebas de Paquetes/Viajes

### 1. Ver Paquetes en Home
**URL**: https://frontend-volabarato.vercel.app/

**Verificar**:
- [ ] Se muestran paquetes destacados
- [ ] Las categorías se muestran correctamente (no "Otros")
- [ ] Las imágenes se cargan correctamente (desde Firebase Storage)
- [ ] Los precios se muestran formateados
- [ ] Los enlaces a detalles funcionan

**Verificar en Network Tab**:
- GET request a `https://backup-volabarato-1.onrender.com/api/paquete` debe retornar 200
- Las imágenes deben cargar desde Firebase Storage URLs

### 2. Ver Todos los Viajes
**URL**: https://frontend-volabarato.vercel.app/viajes

**Verificar**:
- [ ] Se muestran todos los paquetes activos
- [ ] El filtro por categoría funciona
- [ ] La búsqueda por destino funciona
- [ ] Las categorías se asignan correctamente (Caribe, Argentina, Estados Unidos, Brasil, México, Europa, Asia, Aventura, Cultural)

**Probar Filtros**:
1. Seleccionar categoría "Caribe" → Debe mostrar solo paquetes del Caribe
2. Buscar "Miami" → Debe mostrar paquetes relacionados con Miami
3. Buscar "Brasil" → Debe mostrar paquetes de Brasil

---

## 📅 Pruebas de Reservas

### 1. Crear Nueva Reserva (Requiere Login)
**URL**: https://frontend-volabarato.vercel.app/nueva-reserva

**Requisitos**: Usuario autenticado

**Pasos**:
1. Iniciar sesión primero
2. Ir a "Nueva Reserva" o hacer clic en "Reservar" en un paquete
3. Completar formulario:
   - Seleccionar paquete
   - Seleccionar fecha de viaje (futura)
   - Seleccionar cantidad de personas
   - Completar datos de contacto
   - Seleccionar método de pago
4. Hacer clic en "Reservar"
5. **Resultado esperado**: Redirección a página de pago

**Verificar en Network Tab**:
- POST request a `/api/reserva` debe retornar 201
- El body debe contener todos los datos de la reserva

**Verificar en Logs de Render**:
- La reserva debe crearse con estado "pendiente"
- El número de reserva debe generarse automáticamente

### 2. Ver Mis Reservas
**URL**: https://frontend-volabarato.vercel.app/mis-reservas

**Requisitos**: Usuario autenticado

**Verificar**:
- [ ] Se muestran todas las reservas del usuario
- [ ] Los filtros por estado funcionan
- [ ] Los detalles de cada reserva son correctos
- [ ] El botón de cancelar funciona (si el estado lo permite)

**Probar Filtros**:
1. Seleccionar "Pendientes" → Debe mostrar solo reservas pendientes
2. Seleccionar "Confirmadas" → Debe mostrar solo reservas confirmadas

### 3. Ver Detalles de Reserva (Admin)
**URL**: https://frontend-volabarato.vercel.app/admin

**Requisitos**: Usuario con rol `admin`

**Pasos**:
1. Iniciar sesión como admin
2. Ir a la pestaña "Reservas"
3. Hacer clic en el ícono del ojo (👁️) en una reserva
4. **Resultado esperado**: 
   - Se abre un modal con todos los detalles de la reserva
   - Todos los campos están deshabilitados (solo lectura)
   - Solo hay un botón "Cerrar"

---

## 💳 Pruebas de Pagos

### 1. Proceso de Pago
**URL**: https://frontend-volabarato.vercel.app/pago/:reservaId

**Requisitos**: Usuario autenticado, reserva creada

**Pasos**:
1. Crear una reserva primero
2. Serás redirigido automáticamente a la página de pago
3. Seleccionar método de pago:
   - **Tarjeta**: Completar datos de tarjeta
   - **Transferencia**: Completar datos de transferencia
   - **Depósito**: Completar datos de depósito
4. Hacer clic en "Confirmar Pago"
5. **Resultado esperado**: Pago creado y asociado a la reserva

**Verificar en Network Tab**:
- POST request a `/api/pago` debe retornar 201
- El pago debe asociarse correctamente a la reserva

---

## 👥 Pruebas de Administración

### 1. Gestión de Paquetes (Admin)
**URL**: https://frontend-volabarato.vercel.app/admin

**Pestaña**: "Viajes"

**Verificar**:
- [ ] Se muestran todos los paquetes
- [ ] Se puede crear un nuevo paquete
- [ ] Se puede editar un paquete existente
- [ ] Se puede eliminar un paquete
- [ ] La subida de imágenes con Firebase Storage funciona

**Probar Crear Paquete**:
1. Hacer clic en "Crear Nuevo"
2. Completar formulario:
   - Nombre: "Test Paquete"
   - Destino: "Cancún"
   - Descripción: "Paquete de prueba"
   - Precio: 1000
   - Duración: "7 días"
   - Fechas de salida y regreso
   - Categoría: "Caribe"
   - Cupos disponibles: 10
   - Subir al menos una imagen
3. Hacer clic en "Guardar"
4. **Resultado esperado**: 
   - Paquete creado y visible en la lista
   - La imagen se sube a Firebase Storage
   - El paquete es visible en la página principal

**Verificar en Network Tab**:
- POST request a `/api/paquete` debe retornar 201
- POST request a Firebase Storage debe retornar 200

### 2. Gestión de Usuarios (Admin)
**Pestaña**: "Usuarios"

**Verificar**:
- [ ] Se muestran todos los usuarios
- [ ] Se puede crear un nuevo usuario
- [ ] Se puede editar un usuario existente
- [ ] Se puede eliminar un usuario

### 3. Gestión de Suscriptores (Admin)
**Pestaña**: "Suscriptores"

**Verificar**:
- [ ] Se muestran todos los suscriptores
- [ ] Se puede crear un nuevo suscriptor
- [ ] Se puede editar un suscriptor existente
- [ ] Se puede desuscribir un suscriptor
- [ ] Se puede eliminar un suscriptor

### 4. Ver Detalles de Reserva (Admin) - NUEVO
**Pestaña**: "Reservas"

**Verificar**:
- [ ] El ícono del ojo (👁️) abre el modal de detalles
- [ ] Todos los campos están deshabilitados
- [ ] Se muestran todos los datos de la reserva correctamente

---

## 🔧 Pruebas Técnicas

### 1. Verificar CORS
**En Consola del Navegador**:
```javascript
fetch('https://backup-volabarato-1.onrender.com/api/paquete')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```
- No debe haber errores de CORS
- Debe retornar un array de paquetes

### 2. Verificar Firebase Storage
**En Consola del Navegador**:
- Verificar que las imágenes se cargan desde URLs de Firebase Storage
- Las URLs deben ser del formato: `https://firebasestorage.googleapis.com/...`

### 3. Verificar Variables de Entorno
**En Vercel Dashboard**:
- Verificar que todas las variables de entorno estén configuradas:
  - `VITE_API_BASE_URL`: `https://backup-volabarato-1.onrender.com/api`
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`

**En Render Dashboard**:
- Verificar que todas las variables de entorno estén configuradas:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `CORS_ORIGIN`: `https://frontend-volabarato.vercel.app,https://volabarato.vercel.app`
  - `NODE_ENV`: `production`

### 4. Verificar Logs
**En Render Dashboard**:
- Ir a "Logs"
- Verificar que no hay errores críticos
- Verificar que las peticiones se registran correctamente

**En Vercel Dashboard**:
- Ir a "Deployments"
- Verificar que el último deployment fue exitoso
- Verificar los logs de build

---

## 🐛 Problemas Comunes y Soluciones

### Problema: Error de CORS
**Síntomas**: 
- Error en consola: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`
- Las peticiones fallan

**Solución**:
1. Verificar que `CORS_ORIGIN` en Render incluya la URL del frontend
2. Verificar que el backend esté desplegado y funcionando
3. Hacer redeploy del backend si es necesario

### Problema: Las imágenes no cargan
**Síntomas**: 
- Las imágenes aparecen rotas
- Error 403 o 404 en las URLs de Firebase Storage

**Solución**:
1. Verificar que las reglas de Firebase Storage estén publicadas
2. Verificar que las variables de entorno de Firebase estén correctas
3. Verificar que el plan de Firebase esté activo

### Problema: No se puede iniciar sesión
**Síntomas**: 
- Error al intentar iniciar sesión
- Token no se guarda

**Solución**:
1. Verificar que el backend esté funcionando
2. Verificar que `JWT_SECRET` esté configurado en Render
3. Verificar los logs de Render para ver errores específicos

### Problema: No se pueden crear reservas
**Síntomas**: 
- Error al intentar crear una reserva
- Error 400 o 500

**Solución**:
1. Verificar que el usuario esté autenticado
2. Verificar que el token se esté enviando en el header Authorization
3. Verificar los logs de Render para ver errores específicos

---

## 📊 Checklist Final

### Funcionalidades Básicas
- [ ] Frontend carga correctamente
- [ ] Backend responde correctamente
- [ ] No hay errores de CORS
- [ ] Las imágenes se cargan desde Firebase Storage

### Autenticación
- [ ] Registro de usuarios funciona
- [ ] Login funciona
- [ ] Token se guarda correctamente
- [ ] Rutas protegidas funcionan

### Paquetes/Viajes
- [ ] Se muestran paquetes en home
- [ ] Se muestran paquetes en página de viajes
- [ ] Los filtros funcionan
- [ ] Las categorías se asignan correctamente

### Reservas
- [ ] Se pueden crear reservas
- [ ] Se pueden ver reservas
- [ ] Se pueden cancelar reservas
- [ ] Los detalles de reserva se muestran correctamente (admin)

### Pagos
- [ ] Se puede crear un pago
- [ ] Los diferentes métodos de pago funcionan

### Administración
- [ ] Se pueden gestionar paquetes
- [ ] Se pueden gestionar usuarios
- [ ] Se pueden gestionar suscriptores
- [ ] El ícono del ojo funciona para ver detalles de reservas

---

## 📝 Notas

- **Última actualización**: 2025-11-25
- **Versión Frontend**: Desplegado en Vercel
- **Versión Backend**: Desplegado en Render
- **Firebase Storage**: Configurado y funcionando

---

**Siguiente Paso**: Realizar todas las pruebas marcadas en este documento y reportar cualquier problema encontrado.

