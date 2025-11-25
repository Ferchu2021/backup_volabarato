# ✅ Verificación Rápida de Producción - VolaBarato

## 🔗 URLs

- **Frontend**: https://frontend-volabarato.vercel.app/
- **Backend**: https://backup-volabarato-1.onrender.com/api

---

## 🚀 Verificación Inicial (5 minutos)

### 1. Verificar que los Servicios Estén Activos

#### ✅ Frontend (Vercel)
1. Abre: https://frontend-volabarato.vercel.app/
2. **Verifica**:
   - [ ] La página carga sin errores
   - [ ] Se muestran paquetes en la página principal
   - [ ] No hay errores en la consola (F12 → Console)

#### ✅ Backend (Render)
1. Abre: https://backup-volabarato-1.onrender.com/
2. **Resultado esperado**: 
   ```json
   {
     "message": "🚀 Backend VolaBarato API",
     "version": "1.0.0",
     "status": "running"
   }
   ```
3. Prueba: https://backup-volabarato-1.onrender.com/api/paquete
4. **Resultado esperado**: Array JSON de paquetes

---

## 🔧 Verificación Técnica (Consola del Navegador)

### 1. Verificar CORS
**Abre la consola del navegador (F12) y ejecuta:**

```javascript
fetch('https://backup-volabarato-1.onrender.com/api/paquete')
  .then(r => r.json())
  .then(data => {
    console.log('✅ CORS funciona correctamente');
    console.log('Paquetes recibidos:', data.length);
  })
  .catch(error => {
    console.error('❌ Error de CORS:', error);
  });
```

**Resultado esperado**: 
- ✅ Debe mostrar "CORS funciona correctamente"
- ✅ Debe mostrar el número de paquetes

### 2. Verificar Variables de Entorno
**En la consola del navegador:**

```javascript
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
```

**Resultado esperado**: 
- Debe mostrar: `https://backup-volabarato-1.onrender.com/api`

### 3. Verificar Token de Autenticación (después de login)
**En la consola del navegador:**

```javascript
const token = localStorage.getItem('token');
console.log('Token presente:', token ? '✅ Sí' : '❌ No');
if (token) {
  console.log('Token (primeros 20 caracteres):', token.substring(0, 20) + '...');
}
```

---

## 🧪 Pruebas Funcionales (10 minutos)

### 1. Registro de Usuario

**URL**: https://frontend-volabarato.vercel.app/registro

**Datos de Prueba**:
- Usuario: `testuser` + número aleatorio (ej: `testuser123`)
- Contraseña: `testpass123`
- Nombre Legal: `Test User`
- Fecha de Nacimiento: `1990-01-15`
- Nacionalidad: `Argentina`
- DNI: `12345678`
- Número de Pasaporte: `AB123456`
- Teléfono: `+54 9 341 1234567`
- Teléfono de Contacto: `+54 9 341 1234567`
- Email: `test` + número aleatorio + `@example.com` (ej: `test123@example.com`)

**Pasos**:
1. Completa el formulario
2. Haz clic en "Registrarse"
3. **Resultado esperado**: 
   - ✅ Redirección a `/login`
   - ✅ Mensaje: "Cuenta creada exitosamente. Por favor inicia sesión."
   - ✅ No hay errores en la consola

**Verificar en Network Tab (F12 → Network)**:
- POST a `/api/user/register` debe retornar **201** o **200**
- No debe haber errores 400 o 500

### 2. Login

**URL**: https://frontend-volabarato.vercel.app/login

**Pasos**:
1. Ingresa el usuario y contraseña creados
2. Haz clic en "Iniciar Sesión"
3. **Resultado esperado**: 
   - ✅ Redirección según rol (admin → `/admin`, cliente → `/`)
   - ✅ Token guardado en localStorage
   - ✅ Navbar muestra opciones según rol

**Verificar**:
- En consola: `localStorage.getItem('token')` debe retornar un token
- En Network Tab: POST a `/api/user/login` debe retornar **200**

### 3. Ver Paquetes

**URL**: https://frontend-volabarato.vercel.app/viajes

**Verificar**:
- [ ] Se muestran todos los paquetes activos
- [ ] Las imágenes se cargan correctamente (desde Firebase Storage)
- [ ] Los precios se muestran formateados
- [ ] Las categorías se muestran correctamente (no "Otros")

**Probar Filtros**:
1. Selecciona categoría "Caribe" → Debe mostrar solo paquetes del Caribe
2. Busca "Miami" → Debe mostrar paquetes relacionados con Miami

**Verificar en Network Tab**:
- GET a `/api/paquete` debe retornar **200**
- Las imágenes deben cargar desde URLs de Firebase Storage

### 4. Crear Reserva (Requiere Login)

**URL**: https://frontend-volabarato.vercel.app/nueva-reserva

**Pasos**:
1. Asegúrate de estar logueado
2. Selecciona un paquete
3. Completa el formulario:
   - Fecha de viaje (futura)
   - Cantidad de personas
   - Datos de contacto
   - Método de pago
4. Haz clic en "Reservar"
5. **Resultado esperado**: 
   - ✅ Redirección a página de pago
   - ✅ No hay errores en la consola

**Verificar en Network Tab**:
- POST a `/api/reserva` debe retornar **201**

### 5. Ver Mis Reservas

**URL**: https://frontend-volabarato.vercel.app/mis-reservas

**Verificar**:
- [ ] Se muestran las reservas del usuario
- [ ] Los filtros por estado funcionan
- [ ] Los detalles de cada reserva son correctos

### 6. Ver Detalles de Reserva (Admin) - NUEVO

**URL**: https://frontend-volabarato.vercel.app/admin

**Requisitos**: Usuario con rol `admin`

**Pasos**:
1. Inicia sesión como admin
2. Ve a la pestaña "Reservas"
3. Haz clic en el ícono del ojo (👁️) en una reserva
4. **Resultado esperado**: 
   - ✅ Se abre un modal con todos los detalles
   - ✅ Todos los campos están deshabilitados (solo lectura)
   - ✅ Solo hay un botón "Cerrar"

---

## 🔍 Verificación de Firebase Storage

### 1. Verificar que las Imágenes Carguen

**En la consola del navegador:**

```javascript
// Obtener todas las imágenes de la página
const images = document.querySelectorAll('img');
console.log('Total de imágenes:', images.length);
images.forEach((img, index) => {
  if (img.src.includes('firebasestorage')) {
    console.log(`✅ Imagen ${index + 1}: Firebase Storage`);
  } else {
    console.log(`⚠️ Imagen ${index + 1}: ${img.src.substring(0, 50)}...`);
  }
});
```

**Resultado esperado**: 
- Las imágenes de paquetes deben cargar desde Firebase Storage
- URLs deben ser del formato: `https://firebasestorage.googleapis.com/...`

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
- [ ] Los detalles de reserva se muestran correctamente (admin)

### Administración
- [ ] El ícono del ojo funciona para ver detalles de reservas
- [ ] Se pueden gestionar paquetes (si es admin)
- [ ] Se pueden gestionar usuarios (si es admin)

---

## 🐛 Problemas Comunes

### Error: CORS bloqueado
**Solución**: 
1. Verificar que `CORS_ORIGIN` en Render incluya la URL del frontend
2. Hacer redeploy del backend si es necesario

### Error: Las imágenes no cargan
**Solución**: 
1. Verificar que las reglas de Firebase Storage estén publicadas
2. Verificar que las variables de entorno de Firebase estén correctas

### Error: No se puede iniciar sesión
**Solución**: 
1. Verificar que el backend esté funcionando
2. Verificar los logs de Render para ver errores específicos

---

## 📝 Notas

- **Última actualización**: 2025-11-25
- **Versión Frontend**: Optimizada con chunk splitting
- **Versión Backend**: Desplegado en Render
- **Firebase Storage**: Configurado y funcionando

---

**Tiempo estimado de verificación completa**: 15-20 minutos

