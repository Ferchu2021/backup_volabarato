# 🚀 Guía de Deployment del Backend en Render

## 📋 Pasos para Deployar en Render

### 1. Preparar MongoDB Atlas

1. Ve a [MongoDB Atlas](https://cloud.mongodb.com)
2. Asegúrate de que tu cluster esté activo
3. Ve a **Network Access** y agrega:
   - `0.0.0.0/0` (permite todas las IPs) - Para desarrollo/producción
   - O agrega la IP específica de Render si prefieres más seguridad
4. Ve a **Database Access** y verifica que tu usuario tenga permisos

### 2. Obtener Connection String

1. En MongoDB Atlas, haz clic en **"Connect"**
2. Selecciona **"Connect your application"**
3. Copia la connection string
4. Reemplaza `<password>` con tu contraseña
5. Reemplaza `<dbname>` con el nombre de tu base de datos

**Ejemplo**:
```
mongodb+srv://usuario:password123@cluster0.xxxxx.mongodb.net/volabarato?retryWrites=true&w=majority
```

### 3. Crear Servicio en Render

1. Ve a [render.com](https://render.com) e inicia sesión
2. Haz clic en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub: `backup_volabarato`
4. Render detectará automáticamente el archivo `render.yaml`

### 4. Configurar Variables de Entorno

En la sección **"Environment"**, agrega:

```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/volabarato?retryWrites=true&w=majority
JWT_SECRET=tu_secret_key_super_segura_aqui_minimo_32_caracteres
```

**⚠️ IMPORTANTE**:
- Reemplaza `MONGO_URI` con tu connection string real
- Genera un `JWT_SECRET` seguro (mínimo 32 caracteres)
- Puedes generar uno con: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### 5. Configuración del Servicio

Render usará automáticamente la configuración de `render.yaml`:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: Free (puedes cambiar a pago después)

### 6. Deploy

1. Haz clic en **"Create Web Service"**
2. Render comenzará a construir tu aplicación
3. Espera 5-10 minutos (primera vez puede tardar más)
4. Una vez completado, obtendrás una URL como: `https://volabarato-backend.onrender.com`

### 7. Verificar Deployment

1. Abre la URL del backend en tu navegador
2. Deberías ver:
```json
{
  "message": "Backend VolaBarato API",
  "version": "1.0.0",
  "status": "running"
}
```

3. Prueba un endpoint:
   - `https://tu-backend.onrender.com/api/reserva` (debería retornar datos o error de autenticación, no error 404)

### 8. Configurar Auto-Deploy

Render automáticamente hace deploy cuando haces push a la rama `main` en GitHub.

---

## 🔧 Solución de Problemas

### Error: "Cannot connect to MongoDB"

**Solución**:
1. Verifica que `MONGO_URI` sea correcta
2. Verifica que la IP de Render esté en la whitelist de MongoDB Atlas
3. Verifica que el usuario de MongoDB tenga permisos

### Error: "JWT_SECRET is not defined"

**Solución**:
1. Verifica que `JWT_SECRET` esté configurado en las variables de entorno
2. Reinicia el servicio después de agregar la variable

### Error: "Build failed"

**Solución**:
1. Revisa los logs en Render
2. Verifica que `package.json` tenga todos los scripts necesarios
3. Verifica que TypeScript esté configurado correctamente

### El servicio se duerme (Free Plan)

**Problema**: En el plan gratuito, Render "duerme" el servicio después de 15 minutos de inactividad.

**Solución**:
1. La primera petición después de dormir puede tardar 30-60 segundos
2. Considera usar un servicio de "ping" para mantenerlo activo
3. O actualiza al plan pago ($7/mes)

---

## 📝 Notas Importantes

- **Plan Gratuito**: El servicio puede "dormirse" después de inactividad
- **Build Time**: La primera vez puede tardar 5-10 minutos
- **Logs**: Siempre revisa los logs si hay problemas
- **Variables de Entorno**: Nunca las subas a Git

---

## ✅ Checklist de Deployment

- [ ] MongoDB Atlas configurado y accesible
- [ ] Connection string obtenida
- [ ] JWT_SECRET generado
- [ ] Servicio creado en Render
- [ ] Variables de entorno configuradas
- [ ] Deploy completado exitosamente
- [ ] Backend responde correctamente
- [ ] CORS configurado (ya está en el código)

---

¡Listo! Tu backend estará disponible en producción. 🚀

