# 🔧 Resolver Problema de Autenticación MongoDB

## Error: "bad auth : authentication failed"

El usuario de base de datos que estamos intentando usar no existe o la contraseña es incorrecta.

## Opción 1: Obtener Connection String desde MongoDB Atlas

1. **Accede a MongoDB Atlas**: https://cloud.mongodb.com/v2/68ca205aebc3051a2568e239

2. **Ve a tu cluster "Cluster0"**

3. **Haz clic en "Connect"** (botón verde en la tarjeta del cluster)

4. **Selecciona "Connect your application"**

5. **Copia el connection string** que se te muestra, debería verse así:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. **Importante**: 
   - Reemplaza `<username>` con tu usuario de base de datos real
   - Reemplaza `<password>` con tu contraseña real
   - Agrega `/volabarato` antes del `?` para especificar la base de datos

Ejemplo final:
```
mongodb+srv://mi_usuario_real:mi_contraseña_real@cluster0.2gpvxh5.mongodb.net/volabarato?retryWrites=true&w=majority
```

7. Una vez que tengas el connection string correcto, actualiza el archivo `.env`

## Opción 2: Crear Nuevo Usuario de Base de Datos

Si no tienes un usuario de base de datos en MongoDB Atlas:

1. En MongoDB Atlas, ve a **"Database Access"** en el menú lateral
2. Haz clic en **"Add New Database User"**
3. Configura:
   - **Authentication Method**: Password
   - **Username**: (el que quieras, ej: `volabarato_admin`)
   - **Password**: (genera una segura o usa una tuya)
   - **Database User Privileges**: Atlas Admin (o Read and write to any database)
4. Haz clic en **"Add User"**
5. Usa este nuevo usuario y contraseña en el connection string

## Opción 3: Verificar IP Allowlist

Además de las credenciales, asegúrate que tu IP esté permitida:

1. En MongoDB Atlas, ve a **"Network Access"** en el menú lateral
2. Verifica que tu IP esté en la lista
3. Si no, haz clic en "Add IP Address"
4. Puedes usar "Add Current IP Address" o temporalmente "Allow Access from Anywhere" (`0.0.0.0/0`)

## Una vez que tengas el connection string correcto:

Comparte el connection string conmigo y actualizaré el archivo `.env` automáticamente.

**IMPORTANTE**: No compartas las credenciales en chat si van a ser públicas. Puedes usar el formato:
```
mongodb+srv://USUARIO:***CONTRASEÑA_OCULTA***@cluster0.xxxxx.mongodb.net/volabarato?retryWrites=true&w=majority
```

