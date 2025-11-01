# 📋 Pasos para crear Database User en MongoDB Atlas

El usuario `mariafernandarodriguezuai_db_user` que viste es un **Cluster User**, no un **Database User**.

Para conectar desde tu backend necesitas un **Database User**.

## Pasos:

1. En MongoDB Atlas, ve a **"Database Access"** en el menú lateral (NO a "Cluster Users")

2. Haz clic en **"+ ADD NEW DATABASE USER"**

3. Configura:
   - **Authentication Method**: Password
   - **Username**: `volabarato_user` (o el que prefieras)
   - **Password**: `Admin123` (o una que prefieras, fácil de recordar)
   - **Database User Privileges**: 
     - Selecciona "Atlas Admin" 
     - O "Read and write to any database"

4. Haz clic en **"Add User"**

5. Una vez creado, usa este nuevo usuario en el connection string:

```
mongodb+srv://volabarato_user:Admin123@cluster0.2gpvxh5.mongodb.net/volabarato?retryWrites=true&w=majority&appName=Cluster0
```

## Verificar IP Access

Además, en "Network Access":
- Si no está, haz clic en "Add My Current IP Address"
- O usa "0.0.0.0/0" para permitir desde cualquier IP (solo desarrollo)

---

Una vez que crees el Database User, comparte el connection string conmigo y actualizaré automáticamente el `.env` y crearemos el usuario administrador de la aplicación.

