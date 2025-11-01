# 🔐 Guía para Crear el Usuario Administrador

## Usuario: **fernanda**
## Contraseña: **123456.a**

## 📋 Opciones para crear el usuario administrador:

### Opción 1: Usar el Panel de Administración (Recomendado si ya tienes acceso)

1. Inicia el backend: `npm run dev`
2. Inicia el frontend: `cd ../frontend_volabarato && npm run dev`
3. Accede a: `http://localhost:3000/admin`
4. Si ya tienes credenciales, inicia sesión
5. Ve a la pestaña "Usuarios"
6. Haz clic en "Crear Nuevo"
7. Completa el formulario:
   - Usuario: `fernanda`
   - Contraseña: `123456.a`
   - Confirmar Contraseña: `123456.a`

### Opción 2: Usar la API directamente (Primer usuario)

Si es la primera vez y no tienes ningún usuario creado:

1. Asegúrate de que el backend esté corriendo: `npm run dev`
2. Ejecuta el script:
   ```bash
   node scripts/createAdminUser.js
   ```

### Opción 3: Usar MongoDB directamente

Si prefieres crear el usuario directamente en la base de datos:

1. Conéctate a tu MongoDB (MongoDB Compass, CLI, etc.)
2. Selecciona la base de datos `volabarato`
3. Ve a la colección `users`
4. Inserta el siguiente documento:
   ```json
   {
     "usuario": "fernanda",
     "password": "[hash generado por bcrypt]"
   }
   ```

**Nota**: Esta opción requiere hashear manualmente la contraseña usando bcrypt.

### Opción 4: Usar Postman o similar

1. Configura una petición POST a: `http://localhost:4000/api/user/register`
2. Headers: `Content-Type: application/json`
3. Body (JSON):
   ```json
   {
     "usuario": "fernanda",
     "password": "123456.a"
   }
   ```

---

## ⚠️ Configuración Requerida

Antes de crear el usuario, asegúrate de tener:

1. ✅ Archivo `.env` configurado con:
   ```env
   MONGO_URI=tu_connection_string_de_mongodb
   JWT_SECRET=tu_jwt_secret_muy_seguro_y_largo_aqui_2024
   PORT=4000
   ```

2. ✅ Backend corriendo en el puerto 4000

3. ✅ MongoDB accesible (local o Atlas)

---

## 🔍 Verificar que funciona

Después de crear el usuario:

```bash
# Probar login via API
curl -X POST http://localhost:4000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"fernanda","password":"123456.a"}'
```

Deberías recibir un token JWT si las credenciales son correctas.

