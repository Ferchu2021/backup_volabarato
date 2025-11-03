# Volá Barato - Backend API

API REST completa desarrollada con Node.js, Express, TypeScript y MongoDB para la gestión de reservas, paquetes y usuarios de la agencia de turismo Volá Barato.

## 🚀 Características Principales

- ✅ **API REST completa** con Express.js y TypeScript
- ✅ **Base de datos MongoDB** con Mongoose
- ✅ **Autenticación JWT** segura
- ✅ **Validación de datos** con Joi
- ✅ **Número de reserva automático** único
- ✅ **Conversión de monedas** integrada
- ✅ **Estadísticas en tiempo real**
- ✅ **Paginación** en todas las consultas
- ✅ **Middleware de autenticación** reutilizable

## 🛠️ Tecnologías Utilizadas

- **Node.js** 18+
- **Express.js** - Framework web
- **TypeScript** - Tipado estático
- **MongoDB Atlas** - Base de datos en la nube
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación con tokens
- **Joi** - Validación de schemas
- **bcryptjs** - Hash de contraseñas

## 📋 Prerrequisitos

- Node.js 16 o superior
- npm o yarn
- Cuenta de MongoDB Atlas
- Git

## 🚀 Instalación Rápida

1. **Clonar el repositorio**:
```bash
git clone https://github.com/Ferchu2021/backup_volabarato.git
cd backup_volabarato
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:

Crea un archivo `.env` en la raíz:
```env
PORT=4000
MONGO_URI=mongodb+srv://tu-usuario:tu-password@cluster0.2gpvxh5.mongodb.net/volabarato?retryWrites=true&w=majority
JWT_SECRET=tu_secret_key_super_segura
NODE_ENV=development
```

4. **Compilar TypeScript**:
```bash
npm run build
```

5. **Iniciar el servidor**:
```bash
npm run dev
```

El backend estará disponible en `http://localhost:4000`

📖 **Ver `INSTRUCCIONES_INSTALACION.md` para guía detallada completa**

## 📚 Endpoints de la API

### Autenticación
- `POST /api/user/login` - Iniciar sesión
- `GET /api/user` - Obtener todos los usuarios

### Paquetes
- `GET /api/paquete` - Listar todos los paquetes
- `GET /api/paquete/:id` - Obtener un paquete por ID

### Reservas
- `GET /api/reserva` - Listar todas las reservas (con filtros y paginación)
- `GET /api/reserva/:id` - Obtener reserva por ID
- `GET /api/reserva/mis-reservas` - Obtener reservas del usuario autenticado
- `POST /api/reserva` - Crear nueva reserva (requiere autenticación)
- `PUT /api/reserva/:id` - Actualizar reserva (requiere autenticación)
- `PUT /api/reserva/:id/cancelar` - Cancelar reserva
- `PUT /api/reserva/:id/confirmar` - Confirmar reserva
- `DELETE /api/reserva/:id` - Eliminar reserva
- `GET /api/reserva/stats` - Obtener estadísticas

## 🔐 Autenticación

El sistema usa JWT (JSON Web Tokens) para la autenticación:

1. El usuario hace login con `POST /api/user/login`
2. El servidor responde con un token JWT
3. El frontend incluye este token en el header: `Authorization: Bearer <token>`
4. El middleware `auth` valida el token en cada petición protegida

### Credenciales de Prueba
- **Usuario**: `fernanda`
- **Contraseña**: `123456.a`

## 🧪 Testing

Ver archivos de documentación para scripts de prueba:
- `PRUEBAS_RESERVAS.md`
- `TESTING_GUIDE.md`
- `REPORTE_PRUEBAS.md`

## 📊 Modelos de Datos

### Reserva
```typescript
{
  numeroReserva: string,        // Generado automáticamente
  usuario: ObjectId,            // Del token JWT
  paquete: ObjectId,
  fechaReserva: Date,
  fechaViaje: Date,
  cantidadPersonas: number,
  precioTotal: number,          // Siempre en ARS
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada',
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia',
  observaciones?: string,
  datosContacto: {
    nombre: string,
    email: string,
    telefono: string
  }
}
```

### Paquete
```typescript
{
  nombre: string,
  destino: string,
  fecha: Date,
  precio: number,
  descripcion?: string,
  activo: boolean
}
```

## 🎯 Características Destacadas

### 1. Números de Reserva Automáticos
Formato: `RES-YYYYMMDD-TIMESTAMP-RANDOM`
- Generado automáticamente en el pre-save hook
- Único e indexado
- No requiere consultas adicionales

### 2. Conversión de Monedas
- El frontend permite ingresar en ARS o USD
- Conversión automática a ARS antes de guardar
- Tasa aproximada: 1 USD = 1000 ARS

### 3. Validaciones Robustas
- Fechas futuras obligatorias
- Emails válidos
- Teléfonos formateados
- IDs de MongoDB válidos
- Rangos de valores permitidos

### 4. Estadísticas en Tiempo Real
- Total de reservas
- Reservas por estado
- Ingresos totales
- Gráficos y métricas

## 📦 Scripts Disponibles

```bash
npm run dev      # Modo desarrollo con nodemon
npm run build    # Compilar TypeScript
npm start        # Ejecutar compilado
```

## 🔗 Repositorio Frontend

El frontend está en: https://github.com/Ferchu2021/frontend_volabarato

## 📖 Documentación Adicional

- `INSTRUCCIONES_INSTALACION.md` - Guía completa de instalación
- `PRUEBAS_RESERVAS.md` - Pruebas de funcionalidad
- `RESUMEN_PRUEBAS.md` - Resumen de estado
- `MONGODB_ATLAS_SETUP.md` - Configuración de MongoDB

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Contacto

- **Proyecto**: Volá Barato
- **Autor**: Fernanda Rodríguez
- **Repositorio**: https://github.com/Ferchu2021/backup_volabarato

---

**Volá Barato Backend** - Sistema de Gestión Turística 🚀

