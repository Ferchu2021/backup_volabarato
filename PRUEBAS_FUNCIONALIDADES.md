# 🧪 Guía de Pruebas de Funcionalidades - VolaBarato

## 📋 Instrucciones para Probar la Aplicación

### 🔗 URLs de Producción
- **Frontend**: https://frontend-volabarato.vercel.app/
- **Backend**: https://backup-volabarato-1.onrender.com/api

---

## 1. 🔐 Pruebas de Autenticación

### 1.1 Registro de Usuario
**URL**: https://frontend-volabarato.vercel.app/registro

**Pasos**:
1. Ir a la página de registro
2. Completar todos los campos:
   - Usuario (mínimo 4 caracteres)
   - Contraseña (mínimo 6 caracteres)
   - Nombre Legal
   - Fecha de Nacimiento (formato: YYYY-MM-DD)
   - Nacionalidad
   - DNI
   - CUIL/CUIT (opcional)
   - Número de Pasaporte
   - Teléfono
   - Teléfono de Contacto
   - Email
3. Hacer clic en "Registrarse"
4. **Resultado esperado**: Redirección a la página de login con mensaje de éxito

**Verificar en Backend (Logs de Render)**:
- Deberías ver logs que comienzan con `=== REGISTER USER DEBUG ===`
- El body recibido debe contener todos los campos
- No debe haber errores de validación

### 1.2 Login
**URL**: https://frontend-volabarato.vercel.app/login

**Pasos**:
1. Ingresar usuario y contraseña
2. Hacer clic en "Iniciar Sesión"
3. **Resultado esperado**: 
   - Si es admin → redirección a `/admin`
   - Si es cliente → redirección a `/`

**Verificar**:
- Token almacenado en localStorage
- Usuario autenticado en Redux state
- Navbar muestra opciones según rol

### 1.3 Recuperación de Contraseña
**URL**: https://frontend-volabarato.vercel.app/forgot-password

**Pasos**:
1. Ingresar email
2. Hacer clic en "Enviar"
3. **Resultado esperado**: Mensaje de confirmación

### 1.4 Cambio de Contraseña
**URL**: https://frontend-volabarato.vercel.app/cambiar-contraseña

**Requisitos**: Usuario autenticado

**Pasos**:
1. Ingresar contraseña actual
2. Ingresar nueva contraseña
3. Confirmar nueva contraseña
4. **Resultado esperado**: Mensaje de éxito

---

## 2. 🎫 Pruebas de Paquetes/Viajes

### 2.1 Ver Paquetes en Home
**URL**: https://frontend-volabarato.vercel.app/

**Verificar**:
- [ ] Se muestran paquetes destacados
- [ ] Las categorías se muestran correctamente (no "Otros")
- [ ] Las imágenes se cargan correctamente
- [ ] Los precios se muestran formateados
- [ ] Los enlaces a detalles funcionan

### 2.2 Ver Todos los Viajes
**URL**: https://frontend-volabarato.vercel.app/viajes

**Verificar**:
- [ ] Se muestran todos los paquetes activos
- [ ] El filtro por categoría funciona
- [ ] La búsqueda por destino funciona
- [ ] La paginación funciona (si hay muchos paquetes)
- [ ] Las categorías se asignan correctamente

### 2.3 Crear Paquete (Admin)
**URL**: https://frontend-volabarato.vercel.app/admin

**Requisitos**: Usuario con rol `admin`

**Pasos**:
1. Ir a la pestaña "Viajes"
2. Hacer clic en "Agregar Viaje"
3. Completar formulario:
   - Nombre
   - Destino
   - Descripción
   - Precio
   - Duración
   - Fechas de salida y regreso
   - Categoría
   - Cupos disponibles
   - Subir imágenes (usando Firebase Storage)
4. Hacer clic en "Guardar"
5. **Resultado esperado**: Paquete creado y visible en la lista

**Verificar**:
- [ ] Las imágenes se suben a Firebase Storage
- [ ] Las URLs de las imágenes se guardan correctamente
- [ ] El paquete aparece en la lista
- [ ] El paquete es visible en la página principal

### 2.4 Editar Paquete (Admin)
**Pasos**:
1. En la lista de viajes, hacer clic en "Editar"
2. Modificar campos
3. Guardar cambios
4. **Resultado esperado**: Cambios reflejados en la lista

### 2.5 Eliminar Paquete (Admin)
**Pasos**:
1. En la lista de viajes, hacer clic en "Eliminar"
2. Confirmar eliminación
3. **Resultado esperado**: Paquete eliminado de la lista

---

## 3. 📅 Pruebas de Reservas

### 3.1 Crear Nueva Reserva
**URL**: https://frontend-volabarato.vercel.app/nueva-reserva

**Requisitos**: Usuario autenticado

**Pasos**:
1. Seleccionar un paquete (o usar query param `?paqueteId=XXX`)
2. Seleccionar fecha de viaje
3. Seleccionar cantidad de personas
4. Completar datos de contacto
5. Seleccionar método de pago
6. Hacer clic en "Reservar"
7. **Resultado esperado**: Redirección a página de pago

**Verificar en Backend (Logs de Render)**:
- POST /api/reserva debe retornar 201
- La reserva debe crearse con estado "pendiente"
- El número de reserva debe generarse automáticamente

### 3.2 Ver Mis Reservas
**URL**: https://frontend-volabarato.vercel.app/mis-reservas

**Requisitos**: Usuario autenticado

**Verificar**:
- [ ] Se muestran todas las reservas del usuario
- [ ] Los filtros por estado funcionan
- [ ] Los detalles de cada reserva son correctos
- [ ] El botón de cancelar funciona (si el estado lo permite)

### 3.3 Cancelar Reserva
**Pasos**:
1. En "Mis Reservas", hacer clic en "Cancelar" en una reserva pendiente
2. Confirmar cancelación
3. **Resultado esperado**: Estado cambia a "cancelada"

---

## 4. 💳 Pruebas de Pagos

### 4.1 Proceso de Pago
**URL**: https://frontend-volabarato.vercel.app/pago/:reservaId

**Requisitos**: Usuario autenticado, reserva creada

**Pasos**:
1. Seleccionar método de pago:
   - **Tarjeta**: Completar datos de tarjeta
   - **Transferencia**: Completar datos de transferencia
   - **Depósito**: Completar datos de depósito
2. Hacer clic en "Confirmar Pago"
3. **Resultado esperado**: Pago creado y asociado a la reserva

**Verificar en Backend (Logs de Render)**:
- POST /api/pago debe retornar 201
- El pago debe asociarse correctamente a la reserva
- El estado del pago debe ser "pendiente" o "procesando"

---

## 5. 👥 Pruebas de Administración

### 5.1 Gestión de Usuarios (Admin)
**URL**: https://frontend-volabarato.vercel.app/admin

**Pestaña**: "Usuarios"

**Verificar**:
- [ ] Se muestran todos los usuarios
- [ ] Se puede crear un nuevo usuario
- [ ] Se puede editar un usuario existente
- [ ] Se puede eliminar un usuario

### 5.2 Gestión de Suscriptores (Admin)
**Pestaña**: "Suscriptores"

**Verificar**:
- [ ] Se muestran todos los suscriptores
- [ ] Se puede crear un nuevo suscriptor
- [ ] Se puede editar un suscriptor existente
- [ ] Se puede desuscribir un suscriptor
- [ ] Se puede eliminar un suscriptor

### 5.3 Estadísticas (Admin)
**Verificar**:
- [ ] Se muestran estadísticas de reservas
- [ ] Se muestran estadísticas de suscriptores
- [ ] Los números son correctos

---

## 6. 🔧 Pruebas Técnicas

### 6.1 Integración Frontend-Backend
**Verificar**:
- [ ] Todas las peticiones HTTP funcionan
- [ ] No hay errores de CORS
- [ ] Los tokens de autenticación se envían correctamente
- [ ] Los errores del backend se muestran correctamente en el frontend

### 6.2 Firebase Storage
**Verificar**:
- [ ] Las imágenes se suben correctamente a Firebase Storage
- [ ] Las URLs de las imágenes son accesibles
- [ ] Las imágenes se eliminan cuando se elimina un paquete

### 6.3 Manejo de Errores
**Verificar**:
- [ ] Los errores de validación se muestran correctamente
- [ ] Los errores de red se manejan apropiadamente
- [ ] Los mensajes de error son claros y útiles

### 6.4 Responsive Design
**Verificar**:
- [ ] La aplicación funciona en dispositivos móviles
- [ ] Los formularios son usables en pantallas pequeñas
- [ ] Las imágenes se adaptan correctamente

---

## 7. 🐛 Problemas Conocidos y Soluciones

### Problema: Error "nombreLegal" is not allowed
**Estado**: ✅ Resuelto
**Solución**: Validación Joi mejorada, logging detallado agregado

### Problema: Error de CORS
**Estado**: ✅ Resuelto
**Solución**: URLs por defecto agregadas en configuración de CORS

### Problema: Warnings de Mongoose (índices duplicados)
**Estado**: ✅ Resuelto
**Solución**: Índices explícitos eliminados para campos con `unique: true`

### Problema: Error de módulos en Render
**Estado**: ✅ Resuelto
**Solución**: Extensiones `.js` agregadas, TypeScript en dependencies

---

## 8. ✅ Checklist de Verificación Final

### Frontend
- [x] Registro de usuarios funciona
- [x] Login funciona
- [x] Visualización de paquetes funciona
- [x] Creación de reservas funciona
- [x] Visualización de reservas funciona
- [x] Proceso de pago funciona
- [x] Administración funciona (requiere rol admin)
- [x] Subida de imágenes con Firebase funciona
- [x] Categorización automática funciona
- [x] Manejo de errores funciona

### Backend
- [x] Todas las rutas están configuradas
- [x] Validación de datos funciona
- [x] Autenticación JWT funciona
- [x] CORS configurado correctamente
- [x] Conexión a MongoDB funciona
- [x] Logging detallado implementado

### Integración
- [x] Frontend se conecta correctamente al backend
- [x] CORS funciona en producción
- [x] Firebase Storage integrado
- [x] Variables de entorno configuradas

---

## 📝 Notas para Pruebas Manuales

1. **Abrir la consola del navegador** (F12) para ver errores
2. **Revisar los logs de Render** para ver errores del backend
3. **Probar con diferentes roles**: admin y cliente
4. **Probar con datos válidos e inválidos** para verificar validaciones
5. **Probar en diferentes navegadores** si es posible

---

**Última actualización**: 2025-11-25

