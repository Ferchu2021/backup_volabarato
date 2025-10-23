# VolaBarato Backup API - Guía de Deployment en Render

## 🚀 Configuración para Render

### 1. Variables de Entorno en Render

Configura estas variables en el dashboard de Render:

```bash
# Base de datos MongoDB Atlas
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/volabarato?retryWrites=true&w=majority

# Configuración del servidor
NODE_ENV=production
PORT=10000

# JWT Secret (genera una clave segura)
JWT_SECRET=tu_jwt_secret_muy_seguro_y_largo_para_produccion_2024

# CORS (opcional)
CORS_ORIGIN=https://tu-frontend.com
```

### 2. Configuración del Build

Render detectará automáticamente que es un proyecto Node.js. Configura:

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Node Version**: `18` o superior

### 3. Estructura del Proyecto

```
backup_volabarato/
├── src/                 # Código fuente TypeScript
├── dist/               # Código compilado (generado por build)
├── package.json        # Dependencias y scripts
├── tsconfig.json       # Configuración TypeScript
├── env.example         # Plantilla de variables de entorno
└── VolaBarato_Backup_API.postman_collection.json
```

### 4. Scripts de Package.json

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts"
  }
}
```

### 5. Pasos para Deploy

1. **Conecta tu repositorio** a Render
2. **Selecciona el directorio** `backup_volabarato`
3. **Configura las variables de entorno** (ver punto 1)
4. **Deploy automático** - Render construirá y desplegará

### 6. URLs de la API

Una vez desplegado, tu API estará disponible en:
- **Base URL**: `https://tu-app-name.onrender.com`
- **Health Check**: `https://tu-app-name.onrender.com/`
- **API Endpoints**: `https://tu-app-name.onrender.com/api/`

### 7. Endpoints Disponibles

```
GET  /                    # Health check
POST /api/user/register   # Registro de usuario
POST /api/user/login      # Login de usuario
GET  /api/destino         # Listar destinos
POST /api/destino         # Crear destino
GET  /api/producto        # Listar productos
POST /api/producto        # Crear producto
GET  /api/paquete         # Listar paquetes
POST /api/paquete         # Crear paquete
GET  /api/reserva         # Listar reservas
POST /api/reserva         # Crear reserva
```

### 8. Testing con Postman

1. **Importa la colección**: `VolaBarato_Backup_API.postman_collection.json`
2. **Actualiza la variable**: `base_url` con tu URL de Render
3. **Ejecuta las pruebas** en orden:
   - Health Check
   - Register User
   - Login User (guarda el token)
   - Crear Destino
   - Crear Producto
   - Crear Paquete
   - Crear Reserva

### 9. Monitoreo

Render proporciona:
- **Logs en tiempo real**
- **Métricas de rendimiento**
- **Alertas de errores**
- **Restart automático** en caso de fallos

### 10. Troubleshooting

**Error de conexión a MongoDB:**
- Verifica que `MONGO_URI` sea correcta
- Asegúrate de que la IP de Render esté en la whitelist de MongoDB Atlas

**Error de compilación:**
- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs de build en Render

**Error 404:**
- Verifica que el `PORT` esté configurado correctamente
- Revisa que el servidor esté iniciando correctamente

## 📝 Notas Importantes

- Render tiene un **sleep mode** en el plan gratuito (se despierta en ~30 segundos)
- Para producción, considera el **plan pago** para mejor rendimiento
- Los **logs** son importantes para debugging
- **MongoDB Atlas** es recomendado para producción
