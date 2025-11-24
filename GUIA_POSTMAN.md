# 📮 Guía de Postman para VolaBarato API

## 📋 Información General

**Colección de Postman:** `VolaBarato_Backup_API.postman_collection.json`

**URL del Backend en Producción:**
- Base URL: `https://backup-volabarato-1.onrender.com`
- API Base: `https://backup-volabarato-1.onrender.com/api`

**URL del Backend en Desarrollo:**
- Base URL: `http://localhost:4000`
- API Base: `http://localhost:4000/api`

---

## 🚀 Cómo Importar la Colección en Postman

### Paso 1: Descargar Postman
1. Ve a https://www.postman.com/downloads/
2. Descarga e instala Postman (versión Desktop recomendada)
3. Crea una cuenta o inicia sesión

### Paso 2: Importar la Colección
1. Abre Postman
2. Haz clic en **"Import"** (botón arriba a la izquierda)
3. Selecciona **"File"** o **"Upload Files"**
4. Busca y selecciona: `VolaBarato_Backup_API.postman_collection.json`
5. Haz clic en **"Import"**

### Paso 3: Verificar Variables
1. Una vez importada, haz clic en la colección **"VolaBarato Backup API"**
2. Ve a la pestaña **"Variables"**
3. Verifica que `base_url` esté configurada:
   - **Producción**: `https://backup-volabarato-1.onrender.com`
   - **Desarrollo**: `http://localhost:4000` (si quieres probar localmente)

---

## 📚 Endpoints Disponibles en la Colección

### 1. Health Check
- **GET** `/` - Verificar que el servidor esté funcionando
- **Sin autenticación requerida**

### 2. Autenticación (Auth)
- **POST** `/api/user/register` - Registrar un nuevo usuario
- **POST** `/api/user/login` - Iniciar sesión y obtener token JWT
- **Sin autenticación requerida** (para estos endpoints)

### 3. Destinos
- **GET** `/api/destino` - Obtener todos los destinos
- **POST** `/api/destino` - Crear un nuevo destino (requiere autenticación)
- **GET** `/api/destino/:id` - Obtener un destino específico

### 4. Productos
- **GET** `/api/producto` - Obtener todos los productos
- **POST** `/api/producto` - Crear un nuevo producto (requiere autenticación)

### 5. Paquetes
- **GET** `/api/paquete` - Obtener todos los paquetes
- **POST** `/api/paquete` - Crear un nuevo paquete (requiere autenticación)

### 6. Reservas
- **GET** `/api/reserva` - Obtener todas las reservas del usuario (requiere autenticación)
- **POST** `/api/reserva` - Crear una nueva reserva (requiere autenticación)

---

## 🔐 Cómo Usar la Autenticación

### Paso 1: Registrar un Usuario
1. Abre la colección → **"Auth"** → **"Register User"**
2. El body ya está preconfigurado con datos de ejemplo
3. Haz clic en **"Send"**
4. Copia el token JWT de la respuesta (si se devuelve)

### Paso 2: Iniciar Sesión
1. Abre la colección → **"Auth"** → **"Login User"**
2. Ajusta el body con tus credenciales:
   ```json
   {
     "usuario": "tu_usuario",
     "password": "tu_contraseña"
   }
   ```
3. Haz clic en **"Send"**
4. **IMPORTANTE**: Copia el token de la respuesta

### Paso 3: Guardar el Token
1. En Postman, haz clic en la colección **"VolaBarato Backup API"**
2. Ve a la pestaña **"Variables"**
3. Busca la variable `token`
4. Pega el token JWT que obtuviste del login
5. Haz clic en **"Save"**

### Paso 4: Usar Endpoints Protegidos
Una vez guardado el token, todos los endpoints que requieren autenticación usarán automáticamente el token en el header `Authorization: Bearer {{token}}`

---

## 🧪 Pruebas Recomendadas

### Prueba 1: Health Check
1. Abre **"Health Check"**
2. Haz clic en **"Send"**
3. Debe devolver: `{"message":"🚀 Backend VolaBarato API","version":"1.0.0","status":"running"}`

### Prueba 2: Obtener Paquetes
1. Abre **"Paquetes"** → **"Get All Paquetes"**
2. Haz clic en **"Send"**
3. Debe devolver un array de paquetes

### Prueba 3: Login y Token
1. Abre **"Auth"** → **"Login User"**
2. Ajusta las credenciales si es necesario
3. Haz clic en **"Send"**
4. Verifica que recibas un token
5. Guarda el token en la variable `token`

### Prueba 4: Crear Reserva (Requiere Token)
1. Asegúrate de tener el token guardado
2. Abre **"Reservas"** → **"Create Reserva"**
3. Ajusta el body con un `paquete_id` válido
4. Haz clic en **"Send"**
5. Debe crear la reserva exitosamente

---

## 🔧 Configuración de Variables

### Variables Disponibles en la Colección

1. **base_url**
   - **Producción**: `https://backup-volabarato-1.onrender.com`
   - **Desarrollo**: `http://localhost:4000`
   - **Uso**: Se usa en todas las peticiones

2. **token**
   - **Valor**: Se obtiene del login
   - **Uso**: Se usa en headers de autenticación

3. **destino_id**
   - **Valor**: ID de un destino existente
   - **Uso**: Para crear productos o paquetes asociados a un destino

4. **producto_id**
   - **Valor**: ID de un producto existente
   - **Uso**: Para crear paquetes con productos

5. **paquete_id**
   - **Valor**: ID de un paquete existente
   - **Uso**: Para crear reservas

---

## 📝 Ejemplos de Uso

### Ejemplo 1: Obtener Todos los Paquetes
```
GET {{base_url}}/api/paquete
```

### Ejemplo 2: Login
```
POST {{base_url}}/api/user/login
Body:
{
  "usuario": "admin",
  "password": "tu_contraseña"
}
```

### Ejemplo 3: Crear una Reserva
```
POST {{base_url}}/api/reserva
Headers:
  Authorization: Bearer {{token}}
Body:
{
  "paquete": "{{paquete_id}}",
  "fechaViaje": "2024-06-15",
  "cantidadPersonas": 2,
  "precioTotal": 1299.99,
  "metodoPago": "tarjeta",
  "datosContacto": {
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "telefono": "+1234567890"
  }
}
```

---

## ⚠️ Solución de Problemas

### Problema: "401 Unauthorized"
**Solución:**
- Verifica que tengas el token guardado en la variable `token`
- Verifica que el token no haya expirado (haz login nuevamente)
- Verifica que el header `Authorization` esté configurado como `Bearer {{token}}`

### Problema: "404 Not Found"
**Solución:**
- Verifica que `base_url` esté configurada correctamente
- Verifica que el endpoint sea correcto
- Verifica que el servidor esté corriendo

### Problema: "CORS Error"
**Solución:**
- En desarrollo, verifica que el backend tenga CORS configurado
- En producción, verifica que `CORS_ORIGIN` esté configurado en Render

### Problema: "500 Internal Server Error"
**Solución:**
- Revisa los logs del servidor
- Verifica que las variables de entorno estén configuradas
- Verifica que la base de datos esté conectada

---

## 📊 Verificación para el Docente

### Checklist de Verificación

- [ ] Postman instalado
- [ ] Colección importada correctamente
- [ ] Variable `base_url` configurada con URL de producción
- [ ] Health Check funciona (GET `/`)
- [ ] Login funciona (POST `/api/user/login`)
- [ ] Token guardado en variable `token`
- [ ] Endpoints protegidos funcionan con token
- [ ] Obtener paquetes funciona (GET `/api/paquete`)
- [ ] Crear reserva funciona (POST `/api/reserva`)

---

## 🔗 Enlaces Útiles

- **Postman Download**: https://www.postman.com/downloads/
- **Documentación de Postman**: https://learning.postman.com/
- **Backend API**: https://backup-volabarato-1.onrender.com/api

---

## 📝 Notas Importantes

1. **Token JWT**: Los tokens tienen un tiempo de expiración. Si recibes un 401, haz login nuevamente.

2. **Variables**: Las variables se guardan por colección. Si cambias `base_url`, afectará todas las peticiones.

3. **Ambientes**: Puedes crear diferentes ambientes (Development, Production) en Postman para cambiar fácilmente entre URLs.

4. **Exportar/Importar**: Puedes exportar la colección actualizada y compartirla con tu equipo.

---

¡Listo para probar la API! 🚀

