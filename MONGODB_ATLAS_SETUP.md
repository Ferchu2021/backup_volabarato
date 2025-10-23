# 🗄️ Guía Completa: Configuración MongoDB Atlas para VolaBarato

## 📋 Pasos para Configurar MongoDB Atlas

### 1. 🆕 Crear Cuenta en MongoDB Atlas

1. **Visita MongoDB Atlas**: Ve a [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Registro**: Haz clic en "Try Free" o "Get started free"
3. **Completa el formulario**:
   - Email
   - Contraseña segura
   - Nombre de usuario
   - Acepta términos y condiciones

### 2. 🏗️ Crear tu Primer Cluster

1. **Selecciona el plan gratuito**:
   - Haz clic en "Starter Clusters" (FREE)
   - **NO** selecciones "Dedicated Clusters" (es de pago)

2. **Configuración del cluster**:
   ```
   Cloud Provider: AWS (recomendado)
   Region: Elige la más cercana a tu ubicación
   Cluster Name: volabarato-cluster (o el nombre que prefieras)
   ```

3. **Crear cluster**: Haz clic en "Create Cluster"
   - ⏳ Espera 3-5 minutos mientras se crea

### 3. 🔐 Configurar Acceso de Red

1. **Accede a Network Access**:
   - En el menú lateral, haz clic en "Network Access"
   - Haz clic en "Add IP Address"

2. **Configurar IP**:
   - **Opción 1 (Recomendada)**: "Add Current IP Address"
   - **Opción 2 (Desarrollo)**: "Allow Access from Anywhere" (`0.0.0.0/0`)
   - ⚠️ **Advertencia**: La opción 2 es menos segura pero útil para desarrollo

3. **Confirmar**: Haz clic en "Confirm"

### 4. 👤 Crear Usuario de Base de Datos

1. **Accede a Database Access**:
   - En el menú lateral, haz clic en "Database Access"
   - Haz clic en "Add New Database User"

2. **Configurar usuario**:
   ```
   Authentication Method: Password
   Username: volabarato_user (o el que prefieras)
   Password: [Genera una contraseña segura]
   Database User Privileges: Read and write to any database
   ```

3. **Guardar**: Haz clic en "Add User"
   - 📝 **IMPORTANTE**: Guarda estas credenciales

### 5. 🔗 Obtener String de Conexión

1. **Conectar cluster**:
   - Ve a "Clusters" en el menú lateral
   - Haz clic en "Connect" en tu cluster

2. **Seleccionar método**:
   - Elige "Connect your application"

3. **Copiar connection string**:
   ```
   mongodb+srv://volabarato_user:<password>@volabarato-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

4. **Personalizar**:
   - Reemplaza `<password>` con tu contraseña real
   - Cambia la base de datos: `/volabarato` al final

### 6. 🗃️ Configurar Base de Datos

1. **Crear base de datos**:
   - Haz clic en "Browse Collections"
   - Haz clic en "Create Database"
   - Nombre: `volabarato`
   - Collection: `users` (se creará automáticamente)

2. **Crear colecciones adicionales**:
   ```
   - users
   - destinos
   - productos
   - paquetes
   - reservas
   ```

## 🔧 Configuración en tu Proyecto

### 1. Crear archivo .env

Crea un archivo `.env` en la raíz de tu proyecto:

```bash
# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://volabarato_user:TU_PASSWORD@volabarato-cluster.xxxxx.mongodb.net/volabarato?retryWrites=true&w=majority

# Server Configuration
PORT=4000
NODE_ENV=development
JWT_SECRET=tu_jwt_secret_muy_seguro_y_largo_aqui_2024
```

### 2. Probar Conexión

Ejecuta tu servidor:

```bash
npm run dev
```

Deberías ver:
```
✅ Conectado a MongoDB Atlas
🚀 Backend ready en puerto 4000
📡 API disponible en: http://localhost:4000/api
```

## 🧪 Pruebas de Conexión

### Test 1: Health Check
```bash
curl http://localhost:4000/
```

Respuesta esperada:
```json
{
  "message": "🚀 Backend VolaBarato API",
  "version": "1.0.0",
  "status": "running"
}
```

### Test 2: Crear Usuario
```bash
curl -X POST http://localhost:4000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"usuario": "testuser", "password": "123456"}'
```

## 🔍 Verificar en MongoDB Atlas

1. **Ve a tu cluster** en MongoDB Atlas
2. **Haz clic en "Browse Collections"**
3. **Selecciona la base de datos** `volabarato`
4. **Verifica que se crearon las colecciones**:
   - `users` (cuando registres un usuario)
   - `destinos` (cuando crees un destino)
   - `productos` (cuando crees un producto)
   - `paquetes` (cuando crees un paquete)
   - `reservas` (cuando crees una reserva)

## 🚨 Troubleshooting

### Error: "MongoNetworkError"
**Causa**: IP no autorizada
**Solución**: 
1. Ve a "Network Access" en MongoDB Atlas
2. Agrega tu IP actual o usa `0.0.0.0/0` para desarrollo

### Error: "Authentication failed"
**Causa**: Credenciales incorrectas
**Solución**:
1. Verifica usuario y contraseña en `.env`
2. Asegúrate de que el usuario tenga permisos de lectura/escritura

### Error: "Database not found"
**Causa**: Base de datos no existe
**Solución**:
1. Crea la base de datos `volabarato` en MongoDB Atlas
2. O cambia el nombre en la URL de conexión

## 📊 Monitoreo

### En MongoDB Atlas:
- **Metrics**: Ve el rendimiento de tu cluster
- **Logs**: Revisa logs de conexión y errores
- **Alerts**: Configura alertas para problemas

### En tu aplicación:
- **Logs del servidor**: Revisa la consola
- **Postman**: Usa la colección para pruebas
- **MongoDB Compass**: Cliente visual para explorar datos

## 🎯 Próximos Pasos

1. ✅ **Configurar MongoDB Atlas** (este paso)
2. 🔄 **Probar conexión local**
3. 📱 **Usar Postman para pruebas**
4. 🚀 **Deploy en Render**
5. 🌐 **Configurar dominio personalizado**

---

## 💡 Tips Importantes

- **Plan gratuito**: 512MB de almacenamiento (suficiente para desarrollo)
- **Backup automático**: MongoDB Atlas hace backups automáticos
- **Escalabilidad**: Puedes escalar cuando necesites más recursos
- **Seguridad**: Usa IPs específicas en producción
- **Monitoreo**: Revisa métricas regularmente

¡Tu MongoDB Atlas está listo para VolaBarato! 🚀
