# 📋 Instrucciones para crear usuario administrador

## Usuario: **fernanda**  
## Contraseña: **123456.a**

### Opción más fácil: Panel de Administración Frontend

1. **Asegúrate que el backend esté corriendo**:
   - Ve a: `C:\Users\Administrator\Desktop\volabarato_backend\backup_volabarato`
   - Ejecuta: `npm run dev`
   - Deberías ver: "✅ Conectado a MongoDB Atlas" y "🚀 Backend ready en puerto 4000"

2. **Abre el frontend**:
   - Ya está corriendo en: `http://localhost:3001/`
   - Ve a: `http://localhost:3001/admin`

3. **Inicia sesión** (si ya tienes un usuario) o crea el primer usuario desde la pestaña "Usuarios"

4. En la pestaña "Usuarios":
   - Haz clic en "Crear Nuevo"
   - Usuario: `fernanda`
   - Contraseña: `123456.a`
   - Confirmar Contraseña: `123456.a`
   - Guardar

---

### Opción alternativa: MongoDB Compass o Atlas UI

**IMPORTANTE**: En el panel de MongoDB Atlas:

1. Ve a "Database Access" (no "Database Users")
2. Crea un usuario de base de datos con:
   - Username: `fernanda`
   - Password: `123456.a`  
   - Database: `volabarato`

**NOTA**: Esto es diferente al usuario "mariafernandarodriguezuai_db_user" que usas para conectarte a MongoDB.

---

### Verificar que el backend esté conectado

```bash
# En el directorio backup_volabarato
npm run dev
```

Deberías ver:
```
✅ Conectado a MongoDB Atlas
🚀 Backend ready en puerto 4000
📡 API disponible en: http://localhost:4000/api
```

---

### Problemas comunes

**Error: "bad auth : authentication failed"**
- Verifica que la contraseña en `.env` sea correcta
- Verifica que el usuario de MongoDB Atlas tenga permisos adecuados

**Error: Backend no inicia**
- Verifica que `.env` exista en la raíz del proyecto
- Verifica que MONGO_URI esté correctamente configurado

