# 🚀 VolaBarato Backend - TypeScript

Backend API para la aplicación VolaBarato construido con Node.js, Express y TypeScript.

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- MongoDB Atlas (o MongoDB local)

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd backup_volabarato
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/volabarato?retryWrites=true&w=majority
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_cambiar_en_produccion
```

## 🚀 Scripts Disponibles

- `npm run build`: Compila TypeScript a JavaScript
- `npm start`: Ejecuta la aplicación en producción
- `npm run dev`: Ejecuta en modo desarrollo con nodemon
- `npm run dev:ts`: Ejecuta directamente con ts-node

## 📁 Estructura del Proyecto

```
src/
├── index.ts              # Punto de entrada principal
├── models/               # Modelos de datos con TypeScript
│   ├── User.ts
│   └── Paquete.ts
├── routes/               # Rutas de la API con TypeScript
│   ├── user.ts
│   └── paquete.ts
└── middlewares/          # Middlewares personalizados con TypeScript
    └── auth.ts
```

## 🔧 Configuración TypeScript

El proyecto está configurado con TypeScript usando:

- **Target**: ES2020
- **Module**: CommonJS
- **Strict mode**: Habilitado
- **Source maps**: Habilitados
- **Path mapping**: Configurado para imports absolutos

## 🌐 Endpoints de la API

### Información General
- `GET /` - Información de la API

### Usuarios
- `POST /api/user/register` - Registrar nuevo usuario
- `POST /api/user/login` - Iniciar sesión

### Paquetes
- `GET /api/paquete` - Obtener todos los paquetes activos
- `GET /api/paquete/:id` - Obtener paquete por ID
- `POST /api/paquete` - Crear nuevo paquete (requiere autenticación)
- `PUT /api/paquete/:id` - Actualizar paquete (requiere autenticación)
- `DELETE /api/paquete/:id` - Eliminar paquete (baja lógica, requiere autenticación)

## 🚀 Desarrollo

Para desarrollo local:

```bash
npm run dev
```

Esto iniciará el servidor en modo desarrollo con hot reload.

## 📦 Producción

Para compilar y ejecutar en producción:

```bash
npm run build
npm start
```

## 🔍 Características Implementadas

✅ **Migración Completa a TypeScript**
- Todos los archivos convertidos de `.js` a `.ts`
- Tipado completo con interfaces y tipos
- Configuración TypeScript optimizada

✅ **Validaciones con Joi**
- Validación de datos de entrada
- Mensajes de error descriptivos

✅ **Autenticación JWT**
- Middleware de autenticación
- Protección de rutas sensibles

✅ **Manejo de Errores**
- Try-catch en todas las rutas
- Respuestas de error consistentes

## 🔍 Próximos Pasos

1. Implementar tests unitarios con Jest
2. Configurar ESLint y Prettier
3. Agregar documentación con Swagger
4. Implementar rate limiting
5. Agregar logging avanzado
6. Configurar Docker

## 📝 Notas

- El proyecto está completamente migrado a TypeScript
- Los archivos compilados se generan en la carpeta `dist/`
- Todas las rutas están protegidas con autenticación JWT donde es necesario
- Se implementó baja lógica para los paquetes (soft delete)
