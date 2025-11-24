# ✅ Verificación del Servicio en Render

## 📋 Información del Servicio

- **Nombre**: `backup_volabarato-1`
- **Tipo**: Web Service
- **Runtime**: Node.js
- **Plan**: Free
- **Repositorio**: `Ferchu2021/backup_volabarato`
- **Branch**: `main`
- **URL**: `https://backup-volabarato-1.onrender.com`
- **Service ID**: `srv-d4eaevchg0os73bajpdg`

---

## ✅ Checklist de Verificación

### 1. Variables de Entorno
Verifica que estas variables estén configuradas en Render:

1. **NODE_ENV**
   - ✅ Debe ser: `production`

2. **MONGO_URI**
   - ✅ Debe tener tu connection string de MongoDB Atlas
   - Formato: `mongodb+srv://usuario:password@cluster.mongodb.net/volabarato?retryWrites=true&w=majority`

3. **JWT_SECRET**
   - ✅ Debe tener el valor generado: `7e8d2a1c307c6b52dc6869ecf193952ae23063544180516f0f414e76f4d8f12cb1370e18c53235e8`

4. **CORS_ORIGIN**
   - ⚠️ Temporalmente puede estar vacío o con `*`
   - Se actualizará después con la URL del frontend

5. **PORT** (opcional)
   - ⚠️ NO configures PORT manualmente - Render lo asigna automáticamente

### 2. Build Settings
Verifica en la pestaña "Settings" → "Build & Deploy":

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Node Version**: Debe ser 18 o superior

### 3. Estado del Servicio
Verifica en la pestaña "Logs":

- ✅ El servicio debe estar en estado "Live"
- ✅ Debe mostrar: `✅ Conectado a MongoDB Atlas` (si MongoDB está configurado)
- ✅ Debe mostrar: `Servidor corriendo en puerto XXXX`
- ✅ No debe haber errores críticos

### 4. Pruebas de Endpoints
Prueba estos endpoints en tu navegador:

1. **Health Check:**
   ```
   https://backup-volabarato-1.onrender.com/
   ```
   Debe mostrar: `{"message":"🚀 Backend VolaBarato API","version":"1.0.0","status":"running"}`

2. **API Info:**
   ```
   https://backup-volabarato-1.onrender.com/api
   ```
   Debe mostrar información de la API

3. **Paquetes:**
   ```
   https://backup-volabarato-1.onrender.com/api/paquetes
   ```
   Debe mostrar la lista de paquetes (si hay datos)

---

## 🔧 Cómo Verificar Variables de Entorno

1. En Render, ve a tu servicio: `backup_volabarato-1`
2. Haz clic en la pestaña **"Environment"** (en el menú lateral izquierdo)
3. Verifica que todas las variables estén configuradas
4. Si falta alguna, haz clic en **"Add Environment Variable"**

---

## 🔧 Cómo Verificar Logs

1. En Render, ve a tu servicio: `backup_volabarato-1`
2. Haz clic en la pestaña **"Logs"** (en el menú lateral izquierdo)
3. Revisa los logs más recientes
4. Busca mensajes de éxito o errores

---

## ⚠️ Problemas Comunes

### El servicio no inicia
- **Solución**: Revisa los logs para ver el error específico
- Verifica que todas las variables de entorno estén configuradas
- Verifica que `MONGO_URI` sea correcta

### Error de conexión a MongoDB
- **Solución**: 
  1. Verifica que `MONGO_URI` sea correcta
  2. Ve a MongoDB Atlas → Network Access
  3. Agrega la IP de Render a la whitelist (o usa `0.0.0.0/0` temporalmente)

### CORS Error (después de deployar frontend)
- **Solución**: 
  1. Ve a "Environment" en Render
  2. Actualiza `CORS_ORIGIN` con la URL del frontend
  3. Guarda y Render reiniciará automáticamente

---

## 🎯 Próximos Pasos

Una vez verificado que todo está funcionando:

1. ✅ **Backend funcionando** (ya está)
2. ⏭️ **Deploy del Frontend en Vercel** (siguiente paso)
3. ⏭️ **Actualizar CORS** (después de tener la URL del frontend)
4. ⏭️ **Pruebas finales** (verificar que todo funciona)

---

## 📝 Notas

- El servicio en el plan Free puede "dormirse" después de 15 minutos de inactividad
- La primera petición después de dormir puede tardar ~30 segundos
- Para evitar esto, considera el plan pago o usa un servicio de "ping"

