# 🚀 Guía Paso a Paso para Deployment en Producción

## 📋 Resumen
Esta guía te llevará paso a paso desde el código actual hasta tener la aplicación funcionando en producción.

---

## PASO 1: Preparar el Backend

### 1.1. Generar JWT_SECRET seguro
```bash
# En PowerShell o CMD
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
**Guarda este valor** - lo necesitarás para las variables de entorno.

### 1.2. Verificar MongoDB Atlas
- [ ] Tienes la connection string de MongoDB Atlas
- [ ] La base de datos tiene datos (paquetes, usuarios, etc.)
- [ ] La IP del servidor de producción estará en la whitelist (o usar 0.0.0.0/0 para permitir todas)

### 1.3. Elegir plataforma para Backend
**Opciones recomendadas:**
- **Render** (gratis, fácil) - https://render.com
- **Heroku** (pago después de free tier)
- **Railway** (gratis con límites)
- **DigitalOcean App Platform**

---

## PASO 2: Deploy del Backend (Ejemplo con Render)

### 2.1. Crear cuenta y servicio en Render
1. Ve a https://render.com y crea una cuenta
2. Conecta tu repositorio de GitHub: `Ferchu2021/backup_volabarato`
3. Crea un nuevo **Web Service**

### 2.2. Configurar el servicio
- **Name**: `volabarato-backend` (o el que prefieras)
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Branch**: `main`

### 2.3. Configurar Variables de Entorno en Render
En el dashboard de Render, ve a **Environment** y agrega:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/volabarato?retryWrites=true&w=majority
JWT_SECRET=tu_jwt_secret_generado_en_paso_1.1
CORS_ORIGIN=https://tu-frontend.com,https://www.tu-frontend.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_contraseña_de_aplicación
SMTP_FROM=noreply@volabarato.com
```

**⚠️ IMPORTANTE:**
- Reemplaza `tu-frontend.com` con la URL real de tu frontend
- `SMTP_PASS` debe ser una "contraseña de aplicación" de Gmail (no tu contraseña normal)
- `PORT` se asigna automáticamente por Render, no lo configures

### 2.4. Deploy y verificación
1. Haz clic en **Create Web Service**
2. Render comenzará a construir y desplegar
3. Espera a que termine (puede tardar 5-10 minutos)
4. Obtendrás una URL como: `https://volabarato-backend.onrender.com`

### 2.5. Verificar que el backend funciona
- [ ] Abre `https://tu-backend.onrender.com/api` - debe mostrar información de la API
- [ ] Abre `https://tu-backend.onrender.com/` - debe mostrar mensaje de "Backend VolaBarato API"
- [ ] Revisa los logs en Render - debe mostrar "✅ Conectado a MongoDB Atlas"

---

## PASO 3: Actualizar CORS en Backend

Una vez que tengas la URL del frontend:
1. Ve a **Environment** en Render
2. Actualiza `CORS_ORIGIN` con las URLs reales:
   ```
   CORS_ORIGIN=https://volabarato.com,https://www.volabarato.com
   ```
3. Guarda y Render reiniciará automáticamente

---

## PASO 4: Deploy del Frontend (Ejemplo con Vercel)

### 4.1. Crear cuenta y proyecto en Vercel
1. Ve a https://vercel.com y crea una cuenta
2. Conecta tu repositorio: `Ferchu2021/frontend_volabarato`
3. Crea un nuevo proyecto

### 4.2. Configurar el proyecto
- **Framework Preset**: Vite
- **Root Directory**: `/` (raíz del repositorio)
- **Build Command**: `npm run build` (ya está configurado)
- **Output Directory**: `dist` (ya está configurado)

### 4.3. Configurar Variable de Entorno
En **Environment Variables**, agrega:

```env
VITE_API_BASE_URL=https://tu-backend.onrender.com/api
```

**⚠️ IMPORTANTE:** Reemplaza `tu-backend.onrender.com` con la URL real de tu backend.

### 4.4. Deploy
1. Haz clic en **Deploy**
2. Vercel construirá y desplegará automáticamente
3. Obtendrás una URL como: `https://volabarato.vercel.app`

### 4.5. Verificar que el frontend funciona
- [ ] El sitio carga correctamente
- [ ] No hay errores en la consola del navegador
- [ ] Los paquetes se cargan desde el backend
- [ ] El login funciona

---

## PASO 5: Configurar Dominio Personalizado (Opcional)

### 5.1. Backend (Render)
1. Ve a **Settings** → **Custom Domain**
2. Agrega tu dominio: `api.volabarato.com`
3. Sigue las instrucciones de DNS

### 5.2. Frontend (Vercel)
1. Ve a **Settings** → **Domains**
2. Agrega tu dominio: `volabarato.com`
3. Sigue las instrucciones de DNS

### 5.3. Actualizar Variables de Entorno
Después de configurar dominios:
- **Backend**: Actualizar `CORS_ORIGIN` con el nuevo dominio del frontend
- **Frontend**: Actualizar `VITE_API_BASE_URL` con el nuevo dominio del backend

---

## PASO 6: Verificación Final

### 6.1. Pruebas Funcionales
- [ ] **Home**: Carga correctamente, muestra paquetes destacados
- [ ] **Viajes**: Lista todos los paquetes, filtros funcionan
- [ ] **Login**: Funciona correctamente
- [ ] **Registro**: Crea usuarios correctamente
- [ ] **Reservas**: Se pueden crear reservas
- [ ] **Pago**: El flujo de pago funciona
- [ ] **Admin**: Panel de administración funciona

### 6.2. Pruebas de Seguridad
- [ ] CORS funciona (no hay errores en consola)
- [ ] Autenticación JWT funciona
- [ ] Rutas protegidas están protegidas
- [ ] No hay información sensible expuesta

### 6.3. Pruebas de Performance
- [ ] El sitio carga rápido
- [ ] Las imágenes se cargan correctamente
- [ ] La API responde en tiempo razonable

---

## PASO 7: Monitoreo y Mantenimiento

### 7.1. Configurar Monitoreo
- **Render**: Tiene logs integrados
- **Vercel**: Tiene analytics y logs
- Considera agregar: Sentry para errores, UptimeRobot para monitoreo

### 7.2. Backups
- MongoDB Atlas tiene backups automáticos
- Considera hacer backups manuales periódicos

### 7.3. Actualizaciones
- Los cambios se despliegan automáticamente al hacer push a `main`
- Siempre prueba en desarrollo antes de hacer push

---

## 🔧 Solución de Problemas Comunes

### Problema: Backend no inicia
- **Solución**: Revisa los logs en Render
- Verifica que `MONGO_URI` sea correcta
- Verifica que todas las variables de entorno estén configuradas

### Problema: CORS Error
- **Solución**: Verifica que `CORS_ORIGIN` contenga la URL exacta del frontend
- Asegúrate de que no haya espacios en `CORS_ORIGIN`

### Problema: Frontend no carga paquetes
- **Solución**: Verifica que `VITE_API_BASE_URL` apunte al backend correcto
- Abre la consola del navegador y revisa los errores
- Verifica que el backend esté corriendo

### Problema: MongoDB Connection Error
- **Solución**: Verifica que la IP de Render esté en la whitelist de MongoDB Atlas
- O usa `0.0.0.0/0` para permitir todas las IPs (menos seguro pero más fácil)

---

## 📞 URLs de Referencia

### Desarrollo
- Backend: `http://localhost:4000/api`
- Frontend: `http://localhost:3000`

### Producción (ejemplo)
- Backend: `https://volabarato-backend.onrender.com/api`
- Frontend: `https://volabarato.vercel.app`

---

## ✅ Checklist Final

Antes de considerar el deployment completo:

- [ ] Backend desplegado y funcionando
- [ ] Frontend desplegado y funcionando
- [ ] Variables de entorno configuradas correctamente
- [ ] CORS configurado correctamente
- [ ] MongoDB conectado
- [ ] Todas las funcionalidades probadas
- [ ] Dominios configurados (si aplica)
- [ ] Monitoreo configurado
- [ ] Documentación actualizada

---

## 🎉 ¡Listo!

Una vez completados todos los pasos, tu aplicación estará funcionando en producción.

**Próximos pasos sugeridos:**
1. Configurar SSL/HTTPS (automático en Render y Vercel)
2. Configurar backups automáticos
3. Configurar monitoreo de errores
4. Optimizar performance
5. Configurar CDN para imágenes (opcional)

