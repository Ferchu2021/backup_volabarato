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
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/volabarato?retryWrites=true&w=majority
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
NODE_ENV=development
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
├── app.js               # Archivo original (puede ser eliminado)
├── models/              # Modelos de datos
│   ├── User.js
│   └── Paquete.js
├── routes/              # Rutas de la API
│   ├── user.js
│   └── paquete.js
└── middlewares/         # Middlewares personalizados
    └── auth.js
```

## 🔧 Configuración TypeScript

El proyecto está configurado con TypeScript usando:

- **Target**: ES2020
- **Module**: CommonJS
- **Strict mode**: Habilitado
- **Source maps**: Habilitados
- **Path mapping**: Configurado para imports absolutos

## 🌐 Endpoints de la API

- `GET /` - Información de la API
- `GET /api/paquete` - Obtener paquetes
- `POST /api/paquete` - Crear paquete
- `GET /api/user` - Obtener usuarios
- `POST /api/user` - Crear usuario

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

## 🔍 Próximos Pasos

1. Migrar los archivos `.js` a `.ts` para aprovechar completamente TypeScript
2. Agregar validaciones con Joi o similar
3. Implementar tests unitarios
4. Configurar ESLint y Prettier
5. Agregar documentación con Swagger

## 📝 Notas

- El archivo `index.ts` es el nuevo punto de entrada
- El archivo `app.js` original se mantiene por compatibilidad
- Los archivos compilados se generan en la carpeta `dist/`
