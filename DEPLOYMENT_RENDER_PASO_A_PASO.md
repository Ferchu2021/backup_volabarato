# 🚀 Deployment en Render - Paso a Paso

## 📋 Información Importante

**JWT_SECRET generado:**
```
7e8d2a1c307c6b52dc6869ecf193952ae23063544180516f0f414e76f4d8f12cb1370e18c53235e8
```

**⚠️ GUARDA ESTE VALOR** - Lo necesitarás en el paso 2.3

---

## PASO 1: Crear Cuenta en Render

1. Ve a https://render.com
2. Haz clic en **"Get Started for Free"** o **"Sign Up"**
3. Elige una de estas opciones:
   - **Sign up with GitHub** (recomendado - más fácil)
   - **Sign up with Email**
4. Si eliges GitHub, autoriza Render para acceder a tus repositorios

---

## PASO 2: Conectar Repositorio y Crear Servicio

### 2.1. Conectar Repositorio
1. En el dashboard de Render, haz clic en **"New +"** (arriba a la derecha)
2. Selecciona **"Web Service"**
3. Si es la primera vez, Render te pedirá conectar tu cuenta de GitHub
4. Autoriza Render para acceder a tus repositorios
5. Busca y selecciona: **`backup_volabarato`** (o `Ferchu2021/backup_volabarato`)

### 2.2. Configurar el Servicio
Completa el formulario con estos valores:

- **Name**: `volabarato-backend` (o el nombre que prefieras)
- **Region**: Elige la región más cercana a tus usuarios (ej: `Oregon (US West)` o `Frankfurt (EU Central)`)
- **Branch**: `main` (o `master` si tu branch principal es master)
- **Root Directory**: (deja vacío - Render detectará automáticamente)
- **Runtime**: `Node` (Render lo detectará automáticamente)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Instance Type**: `Free` (para empezar, puedes cambiar después)

### 2.3. Configurar Variables de Entorno
**⚠️ IMPORTANTE:** Haz esto ANTES de hacer clic en "Create Web Service"

Haz clic en **"Advanced"** y luego en **"Add Environment Variable"** para agregar cada una:

#### Variables Requeridas:

1. **NODE_ENV**
   - Key: `NODE_ENV`
   - Value: `production`

2. **MONGO_URI**
   - Key: `MONGO_URI`
   - Value: `mongodb+srv://usuario:password@cluster.mongodb.net/volabarato?retryWrites=true&w=majority`
   - ⚠️ **Reemplaza** `usuario:password@cluster.mongodb.net` con tu connection string real de MongoDB Atlas

3. **JWT_SECRET**
   - Key: `JWT_SECRET`
   - Value: `7e8d2a1c307c6b52dc6869ecf193952ae23063544180516f0f414e76f4d8f12cb1370e18c53235e8`
   - ⚠️ Este es el valor generado - guárdalo seguro

4. **CORS_ORIGIN** (temporal - lo actualizaremos después)
   - Key: `CORS_ORIGIN`
   - Value: `https://volabarato.vercel.app` (o la URL que tendrá tu frontend)
   - ⚠️ Si aún no tienes la URL del frontend, puedes usar `*` temporalmente (menos seguro) o dejarlo vacío y actualizarlo después

#### Variables Opcionales (para emails):

5. **SMTP_HOST**
   - Key: `SMTP_HOST`
   - Value: `smtp.gmail.com` (o tu servidor SMTP)

6. **SMTP_PORT**
   - Key: `SMTP_PORT`
   - Value: `587`

7. **SMTP_SECURE**
   - Key: `SMTP_SECURE`
   - Value: `false`

8. **SMTP_USER**
   - Key: `SMTP_USER`
   - Value: `tu_email@gmail.com` (tu email)

9. **SMTP_PASS**
   - Key: `SMTP_PASS`
   - Value: `tu_contraseña_de_aplicación` (no tu contraseña normal de Gmail)
   - ⚠️ Para Gmail, necesitas crear una "Contraseña de aplicación" en tu cuenta de Google

10. **SMTP_FROM**
    - Key: `SMTP_FROM`
    - Value: `noreply@volabarato.com` (o tu email)

**⚠️ NOTA sobre PORT:**
- NO configures `PORT` manualmente
- Render asigna automáticamente el puerto
- El código ya está configurado para usar `process.env.PORT || 4000`

### 2.4. Crear el Servicio
1. Revisa que todas las variables estén configuradas
2. Haz clic en **"Create Web Service"**
3. Render comenzará a construir y desplegar tu aplicación

---

## PASO 3: Monitorear el Deployment

### 3.1. Ver el Proceso de Build
1. Verás una pantalla con el log del build
2. El proceso puede tardar 5-10 minutos la primera vez
3. Verás mensajes como:
   ```
   ==> Cloning from https://github.com/Ferchu2021/backup_volabarato.git
   ==> Building...
   ==> Installing dependencies...
   ==> Building application...
   ==> Starting...
   ```

### 3.2. Verificar que el Build Funciona
Busca en los logs:
- ✅ `npm install` completado sin errores
- ✅ `npm run build` completado (TypeScript compilado)
- ✅ `npm start` iniciado
- ✅ Mensaje de conexión a MongoDB (si está configurado correctamente)

### 3.3. Errores Comunes

**Error: "Cannot find module"**
- Verifica que `package.json` tenga todas las dependencias
- Verifica que el build se completó correctamente

**Error: "MongoDB connection failed"**
- Verifica que `MONGO_URI` sea correcta
- Verifica que la IP de Render esté en la whitelist de MongoDB Atlas
- Para permitir todas las IPs temporalmente: `0.0.0.0/0` (menos seguro)

**Error: "Port already in use"**
- No debería pasar, pero si pasa, verifica que no configuraste `PORT` manualmente

---

## PASO 4: Verificar que el Backend Funciona

### 4.1. Obtener la URL del Servicio
Una vez que el deployment termine, verás:
- **Status**: `Live` (en verde)
- **URL**: `https://volabarato-backend.onrender.com` (ejemplo)

### 4.2. Probar los Endpoints

Abre en tu navegador o usa Postman:

1. **Health Check:**
   ```
   https://tu-backend.onrender.com/
   ```
   Debe mostrar: `"Backend VolaBarato API funcionando correctamente"`

2. **API Info:**
   ```
   https://tu-backend.onrender.com/api
   ```
   Debe mostrar información de la API

3. **Verificar CORS:**
   - Abre la consola del navegador
   - No debe haber errores de CORS

### 4.3. Verificar Logs
1. En Render, ve a la pestaña **"Logs"**
2. Debes ver:
   - ✅ `✅ Conectado a MongoDB Atlas` (si MongoDB está configurado)
   - ✅ `Servidor corriendo en puerto XXXX`
   - ✅ Sin errores críticos

---

## PASO 5: Actualizar CORS (Después del Frontend)

Una vez que tengas la URL del frontend:

1. Ve a **"Environment"** en Render
2. Busca `CORS_ORIGIN`
3. Actualiza el valor con la URL real del frontend:
   ```
   https://volabarato.vercel.app,https://www.volabarato.vercel.app
   ```
   (o las URLs que correspondan)
4. Guarda los cambios
5. Render reiniciará automáticamente el servicio

---

## PASO 6: Configurar MongoDB Atlas (Si es necesario)

### 6.1. Whitelist de IPs
1. Ve a MongoDB Atlas → Network Access
2. Haz clic en **"Add IP Address"**
3. Opciones:
   - **Opción 1 (Segura)**: Agrega la IP específica de Render (puedes encontrarla en los logs)
   - **Opción 2 (Fácil pero menos segura)**: Agrega `0.0.0.0/0` para permitir todas las IPs

### 6.2. Verificar Usuario de Base de Datos
1. Ve a MongoDB Atlas → Database Access
2. Verifica que el usuario tenga permisos de lectura/escritura
3. Verifica que la contraseña sea correcta en `MONGO_URI`

---

## ✅ Checklist Final

Antes de considerar el backend listo:

- [ ] Servicio creado en Render
- [ ] Variables de entorno configuradas
- [ ] Build completado sin errores
- [ ] Servicio en estado "Live"
- [ ] Endpoint `/` responde correctamente
- [ ] Endpoint `/api` responde correctamente
- [ ] MongoDB conectado (verificar en logs)
- [ ] CORS configurado (después de tener frontend)
- [ ] Logs sin errores críticos

---

## 🔧 Solución de Problemas

### El servicio no inicia
1. Revisa los logs en Render
2. Verifica que todas las variables de entorno estén configuradas
3. Verifica que `MONGO_URI` sea correcta
4. Verifica que el build se completó correctamente

### Error de conexión a MongoDB
1. Verifica que `MONGO_URI` sea correcta
2. Verifica que la IP esté en la whitelist de MongoDB Atlas
3. Verifica que el usuario y contraseña sean correctos

### CORS Error
1. Verifica que `CORS_ORIGIN` contenga la URL exacta del frontend
2. Asegúrate de que no haya espacios en `CORS_ORIGIN`
3. Reinicia el servicio después de cambiar `CORS_ORIGIN`

### El servicio se duerme (Free Tier)
- Render Free Tier "duerme" el servicio después de 15 minutos de inactividad
- La primera petición después de dormir puede tardar ~30 segundos
- Para evitar esto, considera el plan pago o usa un servicio de "ping" para mantenerlo activo

---

## 📝 Notas Importantes

1. **JWT_SECRET**: Guarda el valor generado de forma segura. Si lo pierdes, tendrás que generar uno nuevo y actualizar la base de datos.

2. **MONGO_URI**: Nunca compartas tu connection string públicamente. Está seguro en las variables de entorno de Render.

3. **CORS_ORIGIN**: En producción, nunca uses `*`. Siempre especifica las URLs exactas del frontend.

4. **Logs**: Los logs en Render son útiles para debugging. Revisa la pestaña "Logs" regularmente.

5. **Actualizaciones**: Cada vez que hagas push a `main`, Render desplegará automáticamente los cambios.

---

## 🎉 ¡Siguiente Paso!

Una vez que el backend esté funcionando, continúa con el deployment del frontend en Vercel.

**URL de tu backend:** `https://tu-backend.onrender.com/api`

Guarda esta URL - la necesitarás para configurar el frontend.

