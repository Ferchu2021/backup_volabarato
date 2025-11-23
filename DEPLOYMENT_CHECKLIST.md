# Checklist de Deployment en Producción

## Pre-Deployment

### Backend

- [ ] **Variables de Entorno**
  - [ ] `MONGO_URI` - Connection string de MongoDB Atlas
  - [ ] `PORT` - Puerto del servidor (Render lo asigna automáticamente)
  - [ ] `NODE_ENV=production`
  - [ ] `JWT_SECRET` - Clave secreta segura para JWT
  - [ ] `CORS_ORIGIN` - URLs del frontend separadas por comas (ej: `https://volabarato.com,https://www.volabarato.com`)
  - [ ] `SMTP_HOST` - Servidor SMTP para emails
  - [ ] `SMTP_PORT` - Puerto SMTP
  - [ ] `SMTP_SECURE` - true/false según el puerto
  - [ ] `SMTP_USER` - Usuario de email
  - [ ] `SMTP_PASS` - Contraseña de email
  - [ ] `SMTP_FROM` - Email remitente

- [ ] **Build y Compilación**
  - [ ] Ejecutar `npm run build` para compilar TypeScript
  - [ ] Verificar que `dist/` contiene todos los archivos compilados
  - [ ] Verificar que no hay errores de compilación

- [ ] **Base de Datos**
  - [ ] Verificar conexión a MongoDB Atlas
  - [ ] Verificar que los índices estén creados
  - [ ] Verificar que hay datos de prueba (si es necesario)

- [ ] **Seguridad**
  - [ ] CORS configurado correctamente con `CORS_ORIGIN`
  - [ ] JWT_SECRET es una clave segura y única
  - [ ] Helmet configurado (ya está configurado)
  - [ ] No hay credenciales hardcodeadas

### Frontend

- [ ] **Variables de Entorno**
  - [ ] `VITE_API_BASE_URL` - URL completa del backend en producción (ej: `https://api.volabarato.com/api`)
  - [ ] Verificar que no hay referencias a localhost en producción

- [ ] **Build**
  - [ ] Ejecutar `npm run build` para generar el build de producción
  - [ ] Verificar que `dist/` contiene todos los archivos
  - [ ] Verificar que no hay errores de compilación
  - [ ] Verificar que el tamaño del bundle es razonable

- [ ] **Optimizaciones**
  - [ ] Imágenes optimizadas
  - [ ] Assets estáticos en CDN (si aplica)
  - [ ] Source maps deshabilitados en producción (opcional)

## Deployment

### Backend (Render/Heroku/etc)

1. **Configurar Servicio**
   - [ ] Crear nuevo servicio web
   - [ ] Conectar repositorio Git
   - [ ] Configurar branch (main/master)

2. **Variables de Entorno**
   - [ ] Agregar todas las variables de entorno necesarias
   - [ ] Verificar que `NODE_ENV=production`
   - [ ] Verificar que `CORS_ORIGIN` apunta al frontend

3. **Build Settings**
   - [ ] Build Command: `npm install && npm run build`
   - [ ] Start Command: `npm start` (ejecuta `node dist/index.js`)

4. **Verificación**
   - [ ] El servicio inicia correctamente
   - [ ] Los logs muestran conexión a MongoDB
   - [ ] El endpoint `/api` responde correctamente
   - [ ] CORS funciona correctamente

### Frontend (Vercel/Netlify/etc)

1. **Configurar Proyecto**
   - [ ] Conectar repositorio Git
   - [ ] Configurar branch (main/master)

2. **Variables de Entorno**
   - [ ] `VITE_API_BASE_URL` - URL del backend en producción

3. **Build Settings**
   - [ ] Build Command: `npm run build`
   - [ ] Output Directory: `dist`
   - [ ] Install Command: `npm install`

4. **Verificación**
   - [ ] El build se completa sin errores
   - [ ] El sitio se despliega correctamente
   - [ ] Las rutas funcionan (SPA routing)
   - [ ] Las llamadas a la API funcionan

## Post-Deployment

- [ ] **Pruebas Funcionales**
  - [ ] Login/Registro funciona
  - [ ] Carga de paquetes funciona
  - [ ] Creación de reservas funciona
  - [ ] Pago funciona
  - [ ] Panel de administración funciona

- [ ] **Pruebas de Seguridad**
  - [ ] CORS funciona correctamente
  - [ ] Autenticación JWT funciona
  - [ ] Rutas protegidas están protegidas
  - [ ] No hay información sensible expuesta

- [ ] **Monitoreo**
  - [ ] Configurar logs de errores
  - [ ] Configurar monitoreo de uptime
  - [ ] Configurar alertas de errores

- [ ] **Performance**
  - [ ] Verificar tiempos de carga
  - [ ] Verificar que las imágenes se cargan correctamente
  - [ ] Verificar que la API responde en tiempo razonable

## URLs de Ejemplo

### Backend
- Desarrollo: `http://localhost:4000/api`
- Producción: `https://api.volabarato.com/api` (ejemplo)

### Frontend
- Desarrollo: `http://localhost:3000`
- Producción: `https://volabarato.com` (ejemplo)

## Comandos Útiles

### Backend
```bash
# Build
npm run build

# Iniciar en producción
npm start

# Verificar compilación
npm run build && node dist/index.js
```

### Frontend
```bash
# Build
npm run build

# Preview del build
npm run preview

# Verificar build
npm run build && npm run preview
```

## Notas Importantes

1. **CORS**: En producción, `CORS_ORIGIN` debe contener las URLs exactas del frontend. No usar `*` en producción.

2. **Variables de Entorno**: Nunca commitear archivos `.env` con credenciales reales.

3. **JWT_SECRET**: Debe ser una cadena larga y aleatoria. Generar con: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

4. **MongoDB**: Asegurarse de que la IP del servidor de producción esté en la whitelist de MongoDB Atlas.

5. **Logs**: En producción, los logs deben ser mínimos. Los console.log están condicionados a desarrollo.

6. **Source Maps**: Considerar deshabilitar source maps en producción para seguridad.

