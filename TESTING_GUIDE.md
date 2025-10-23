# 🚀 VolaBarato Backup - Guía de Pruebas de Integración

## ✅ Estado del Proyecto

**Proyecto configurado y listo para pruebas:**
- ✅ Dependencias instaladas
- ✅ TypeScript compilado correctamente
- ✅ Configuración MongoDB lista
- ✅ Colección Postman creada
- ✅ Guía de deployment en Render

## 🔧 Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con:

```bash
# MongoDB Atlas (reemplaza con tu conexión real)
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/volabarato?retryWrites=true&w=majority

# Configuración del servidor
PORT=4000
NODE_ENV=development
JWT_SECRET=tu_jwt_secret_muy_seguro_y_largo_aqui_2024
```

### 2. Iniciar el Servidor

```bash
# Desarrollo (con hot reload)
npm run dev

# O producción
npm run build
npm start
```

## 🧪 Pruebas con Postman

### 1. Importar Colección

1. Abre Postman
2. Importa el archivo: `VolaBarato_Backup_API.postman_collection.json`
3. Configura la variable `base_url` como: `http://localhost:4000`

### 2. Secuencia de Pruebas

**Paso 1: Health Check**
```
GET http://localhost:4000/
```
Respuesta esperada:
```json
{
  "message": "🚀 Backend VolaBarato API",
  "version": "1.0.0",
  "status": "running"
}
```

**Paso 2: Registrar Usuario**
```
POST http://localhost:4000/api/user/register
Content-Type: application/json

{
  "usuario": "testuser",
  "password": "123456"
}
```

**Paso 3: Login**
```
POST http://localhost:4000/api/user/login
Content-Type: application/json

{
  "usuario": "testuser",
  "password": "123456"
}
```
**⚠️ IMPORTANTE:** Guarda el `token` de la respuesta para usar en las siguientes peticiones.

**Paso 4: Crear Destino**
```
POST http://localhost:4000/api/destino
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "nombre": "París",
  "pais": "Francia",
  "descripcion": "La ciudad del amor",
  "imagen": "https://example.com/paris.jpg",
  "actividades": ["Visitar Torre Eiffel", "Recorrer el Louvre"],
  "clima": "Templado",
  "mejor_epoca": "Primavera",
  "requisitos": ["Pasaporte", "Visa Schengen"],
  "costo_promedio": 1500,
  "moneda": "EUR",
  "idioma": "Francés",
  "zona_horaria": "CET"
}
```

**Paso 5: Crear Producto**
```
POST http://localhost:4000/api/producto
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "nombre": "Vuelo a París",
  "descripcion": "Vuelo directo a París desde Madrid",
  "precio": 299.99,
  "categoria": "Vuelos",
  "disponibilidad": true,
  "imagen": "https://example.com/vuelo-paris.jpg",
  "destino": "{{destino_id}}",
  "fecha_salida": "2024-06-15",
  "fecha_regreso": "2024-06-22",
  "aerolinea": "Air France",
  "duracion": "2h 30min"
}
```

**Paso 6: Crear Paquete**
```
POST http://localhost:4000/api/paquete
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "nombre": "Paquete París Completo",
  "descripcion": "7 días en París con vuelo, hotel y actividades",
  "precio": 1299.99,
  "duracion": 7,
  "destino": "{{destino_id}}",
  "productos": ["{{producto_id}}"],
  "incluye": ["Vuelo", "Hotel 4 estrellas", "Desayunos"],
  "no_incluye": ["Almuerzos", "Cenas", "Seguro de viaje"],
  "fecha_inicio": "2024-06-15",
  "fecha_fin": "2024-06-22",
  "max_personas": 2,
  "min_personas": 1
}
```

**Paso 7: Crear Reserva**
```
POST http://localhost:4000/api/reserva
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "paquete": "{{paquete_id}}",
  "fecha_salida": "2024-06-15",
  "fecha_regreso": "2024-06-22",
  "numero_personas": 2,
  "precio_total": 1299.99,
  "estado": "confirmada",
  "metodo_pago": "tarjeta",
  "notas": "Habitación con vista a la Torre Eiffel"
}
```

## 🌐 Deployment en Render

### 1. Preparación

1. **Sube tu código** a GitHub/GitLab
2. **Configura MongoDB Atlas** con una base de datos de producción
3. **Revisa** el archivo `RENDER_DEPLOYMENT_GUIDE.md`

### 2. Configuración en Render

1. **Conecta tu repositorio** a Render
2. **Selecciona** el directorio `backup_volabarato`
3. **Configura variables de entorno**:
   - `MONGO_URI`: Tu conexión MongoDB Atlas
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: Clave segura para producción

### 3. Deploy

Render automáticamente:
- Instalará dependencias (`npm install`)
- Compilará TypeScript (`npm run build`)
- Iniciará el servidor (`npm start`)

## 🔍 Verificación de Funcionamiento

### Logs del Servidor
```
✅ Conectado a MongoDB Atlas
🚀 Backend ready en puerto 4000
📡 API disponible en: http://localhost:4000/api
```

### Respuestas de la API
- **Status 200**: Operación exitosa
- **Status 201**: Recurso creado
- **Status 401**: No autorizado (token inválido)
- **Status 404**: Recurso no encontrado
- **Status 500**: Error del servidor

## 🐛 Troubleshooting

### Error de Conexión MongoDB
```
❌ Error de conexión a MongoDB: MongoNetworkError
```
**Solución**: Verifica que `MONGO_URI` sea correcta y que la IP esté en la whitelist de MongoDB Atlas.

### Error de Compilación
```
error TS2307: Cannot find module 'mongoose'
```
**Solución**: Ejecuta `npm install` para instalar dependencias.

### Error 401 Unauthorized
```
{
  "error": "Token no válido"
}
```
**Solución**: Asegúrate de incluir el header `Authorization: Bearer {{token}}` en las peticiones protegidas.

## 📊 Monitoreo

### Métricas Importantes
- **Tiempo de respuesta** de la API
- **Conexiones activas** a MongoDB
- **Memoria utilizada** por el servidor
- **Logs de errores** en tiempo real

### Alertas Recomendadas
- Servidor no responde
- Error de conexión a MongoDB
- Alto uso de memoria
- Múltiples errores 500

---

## 🎯 Próximos Pasos

1. **Prueba local** con MongoDB Atlas
2. **Deploy en Render** con variables de producción
3. **Configura dominio personalizado** (opcional)
4. **Implementa monitoreo** avanzado
5. **Configura CI/CD** para deploys automáticos

¡Tu API está lista para ser probada! 🚀
