# 📋 Instrucciones de Instalación y Ejecución

## Guía completa para ejecutar el proyecto Volá Barato

## 🔧 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:
- **Node.js** (versión 16 o superior)
- **npm** (incluido con Node.js)
- **Git** para clonar los repositorios
- Una cuenta de **MongoDB Atlas** o MongoDB local

## 📂 Estructura del Proyecto

El proyecto consta de **dos partes**:
1. **Backend** (API REST con Node.js, Express y MongoDB)
2. **Frontend** (SPA con React, TypeScript y Redux)

## 🚀 Instalación Paso a Paso

### 1️⃣ Backend

#### Clonar el repositorio del Backend
```bash
git clone https://github.com/Ferchu2021/backup_volabarato.git
cd backup_volabarato
```

#### Instalar dependencias
```bash
npm install
```

#### Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto backend con el siguiente contenido:

```env
# Puerto del servidor
PORT=4000

# MongoDB connection string
MONGO_URI=mongodb+srv://tu-usuario:tu-password@cluster0.2gpvxh5.mongodb.net/volabarato?retryWrites=true&w=majority

# JWT Secret (cambiar por uno seguro en producción)
JWT_SECRET=tu_secret_key_super_segura_aqui

# Ambiente
NODE_ENV=development
```

> ⚠️ **IMPORTANTE**: Debes obtener tu propia cadena de conexión de MongoDB Atlas y reemplazar `tu-usuario` y `tu-password`.

#### Compilar TypeScript
```bash
npm run build
```

#### Iniciar el servidor
```bash
npm run dev
```

El backend estará disponible en: `http://localhost:4000`

Deberías ver en la consola:
```
✅ Conectado a MongoDB Atlas
🚀 Backend ready en puerto 4000
📡 API disponible en: http://localhost:4000/api
```

---

### 2️⃣ Frontend

#### Clonar el repositorio del Frontend
```bash
git clone https://github.com/Ferchu2021/frontend_volabarato.git
cd frontend_volabarato
```

#### Instalar dependencias
```bash
npm install
```

#### Iniciar el servidor de desarrollo
```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

---

## 🔐 Credenciales de Acceso

Para acceder al panel de administración, usa las siguientes credenciales:

- **Usuario**: `fernanda`
- **Contraseña**: `123456.a`

---

## ✅ Verificación de la Instalación

### Verificar Backend

1. Abre tu navegador o terminal y visita:
   ```
   http://localhost:4000/api/paquete
   ```
   Deberías ver un array JSON con paquetes de prueba.

2. Verifica las rutas principales:
   - `http://localhost:4000/api/paquete` - Lista de paquetes
   - `http://localhost:4000/api/user` - Lista de usuarios
   - `http://localhost:4000/api/reserva/stats` - Estadísticas de reservas

### Verificar Frontend

1. Abre tu navegador en:
   ```
   http://localhost:5173
   ```

2. Deberías ver la página de inicio de Volá Barato.

3. Inicia sesión con las credenciales proporcionadas arriba.

4. Verifica que el panel de administración cargue correctamente.

---

## 🧪 Funcionalidades para Probar

### Panel de Administración

1. **Gestión de Viajes**:
   - Crear nuevos viajes
   - Subir imágenes
   - Seleccionar categorías
   - Precios en ARS o USD

2. **Gestión de Reservas**:
   - Crear reservas nuevas
   - Ver lista de reservas
   - Editar reservas existentes
   - Cambiar estados (pendiente, confirmada, cancelada)
   - Eliminar reservas

3. **Gestional de Suscriptores**:
   - Ver lista de suscriptores
   - Crear nuevos suscriptores
   - Editar información

4. **Gestión de Usuarios**:
   - Ver lista de usuarios
   - Crear nuevos usuarios
   - Editar usuarios

### Características Especiales

- ✅ **Conversión de Monedas**: Las reservas pueden crearse en ARS o USD con conversión automática
- ✅ **Validación de Fechas**: Solo permite fechas futuras
- ✅ **Números de Reserva Automáticos**: Formato RES-YYYYMMDD-TIMESTAMP-RANDOM
- ✅ **Autenticación JWT**: Sistema de login seguro
- ✅ **Estadísticas en Tiempo Real**: Panel con contadores y totales

---

## 🛠️ Comandos Útiles

### Backend

```bash
# Desarrollo con hot-reload
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar compilado
node dist/index.js

# Ver logs
npm run dev
```

### Frontend

```bash
# Desarrollo con hot-reload
npm run dev

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview
```

---

## 📊 Datos de Prueba

El sistema incluye datos de prueba:

- **Paquetes**: Varios paquetes de prueba con diferentes destinos
- **Reservas**: Reservas de ejemplo para testing
- **Usuarios**: Usuario administrador preconfigurado

---

## 🐛 Solución de Problemas Comunes

### Error: "Cannot connect to MongoDB"
- Verifica que tu cadena de conexión en `.env` sea correcta
- Asegúrate de que tu IP esté permitida en MongoDB Atlas
- Verifica que tu usuario de base de datos tenga permisos adecuados

### Error: "Port 4000 already in use"
- Cierra cualquier otro proceso usando el puerto 4000
- O cambia el puerto en el archivo `.env`

### Error: "Cannot find module"
- Ejecuta `npm install` en ambos proyectos (backend y frontend)
- Verifica que todas las dependencias estén instaladas

### Error en el frontend: "Failed to fetch"
- Asegúrate de que el backend esté corriendo
- Verifica la URL del backend en `src/services/api.ts`
- Comprueba la consola del navegador para más detalles

---

## 📁 URLs Importantes

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000/api
- **Panel Admin**: http://localhost:5173/admin
- **Mis Reservas**: http://localhost:5173/mis-reservas
- **Nueva Reserva**: http://localhost:5173/nueva-reserva

---

## 📝 Notas Importantes

1. **Ambiente de Desarrollo**: Esta configuración es para desarrollo. Para producción, debes:
   - Cambiar el JWT_SECRET por uno seguro
   - Configurar HTTPS
   - Implementar validaciones adicionales
   - Configurar backups de base de datos

2. **Base de Datos**: Usa MongoDB Atlas para una base de datos en la nube gratuita.

3. **CORS**: El backend está configurado para aceptar peticiones desde `localhost:5173`.

---

## 🆘 Soporte

Si tienes problemas durante la instalación:

1. Verifica que cumplas con todos los prerrequisitos
2. Revisa los logs de consola en backend y frontend
3. Confirma que las variables de entorno estén correctamente configuradas
4. Asegúrate de que ambos servidores estén corriendo simultáneamente

---

**Volá Barato** - Sistema de Gestión Turística ✈️

