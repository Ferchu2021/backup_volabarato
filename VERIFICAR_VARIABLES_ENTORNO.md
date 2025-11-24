# 🔍 Guía Paso a Paso: Verificar Variables de Entorno en Render

## 📍 Ubicación en Render

1. Ve a https://render.com
2. Inicia sesión con tu cuenta
3. En el dashboard, busca y haz clic en tu servicio: **`backup_volabarato-1`**

---

## PASO 1: Acceder a la Sección de Variables de Entorno

### 1.1. Encontrar el Menú Lateral
Una vez dentro de tu servicio, verás un menú lateral izquierdo con varias opciones:
- Overview
- **Environment** ← **Haz clic aquí**
- Logs
- Events
- Settings
- etc.

### 1.2. Hacer Clic en "Environment"
Haz clic en **"Environment"** en el menú lateral izquierdo.

---

## PASO 2: Verificar Variables Existentes

### 2.1. Ver la Lista de Variables
En la página de "Environment", verás una tabla con todas las variables de entorno configuradas.

La tabla tiene estas columnas:
- **Key** (nombre de la variable)
- **Value** (valor - puede estar oculto con puntos)
- **Sync** (sincronización)
- **Actions** (acciones)

### 2.2. Ver el Valor de una Variable
- Para ver el valor completo, haz clic en el ícono del ojo 👁️ o en "Reveal"
- Para editar, haz clic en el ícono de lápiz ✏️ o en "Edit"

---

## PASO 3: Verificar Cada Variable Requerida

### ✅ Variable 1: NODE_ENV

**Debe estar configurada así:**
- **Key**: `NODE_ENV`
- **Value**: `production`
- **Sync**: (puede estar vacío o marcado)

**Si NO existe:**
1. Haz clic en **"Add Environment Variable"** (botón arriba a la derecha)
2. Key: `NODE_ENV`
3. Value: `production`
4. Haz clic en **"Save"**

**Si existe pero tiene otro valor:**
1. Haz clic en el ícono de editar (lápiz) junto a la variable
2. Cambia el Value a: `production`
3. Haz clic en **"Save"**

---

### ✅ Variable 2: MONGO_URI

**Debe estar configurada así:**
- **Key**: `MONGO_URI`
- **Value**: Tu connection string de MongoDB Atlas
- Formato: `mongodb+srv://usuario:password@cluster.mongodb.net/volabarato?retryWrites=true&w=majority`

**Si NO existe:**
1. Haz clic en **"Add Environment Variable"**
2. Key: `MONGO_URI`
3. Value: Pega tu connection string de MongoDB Atlas
4. Haz clic en **"Save"**

**Si existe pero no estás seguro del valor:**
1. Haz clic en el ícono del ojo para revelar el valor
2. Verifica que tenga el formato correcto
3. Si necesitas cambiarlo, haz clic en editar

**⚠️ IMPORTANTE:**
- El connection string debe tener tu usuario y contraseña reales
- Debe apuntar a la base de datos correcta (`volabarato`)
- Si no tienes el connection string, ve a MongoDB Atlas → Connect → Connect your application

---

### ✅ Variable 3: JWT_SECRET

**Debe estar configurada así:**
- **Key**: `JWT_SECRET`
- **Value**: `7e8d2a1c307c6b52dc6869ecf193952ae23063544180516f0f414e76f4d8f12cb1370e18c53235e8`

**Si NO existe:**
1. Haz clic en **"Add Environment Variable"**
2. Key: `JWT_SECRET`
3. Value: `7e8d2a1c307c6b52dc6869ecf193952ae23063544180516f0f414e76f4d8f12cb1370e18c53235e8`
4. Haz clic en **"Save"`

**Si existe pero tiene otro valor:**
1. Haz clic en el ícono de editar
2. Cambia el Value al valor correcto (el de arriba)
3. Haz clic en **"Save"**

---

### ⚠️ Variable 4: CORS_ORIGIN (Temporal)

**Por ahora puede estar:**
- Vacía (no existe)
- Con valor `*` (temporal)
- Con una URL temporal

**Se actualizará después** cuando tengas la URL del frontend.

**Si NO existe:**
- Por ahora está bien, la agregaremos después

**Si existe con `*`:**
- Por ahora está bien para pruebas
- La actualizaremos después con la URL real del frontend

---

### ❌ Variable que NO debe existir: PORT

**⚠️ IMPORTANTE:**
- NO debes tener una variable llamada `PORT`
- Render asigna el puerto automáticamente
- Si existe, puedes eliminarla (no es crítica, pero no es necesaria)

---

## PASO 4: Variables Opcionales (para emails)

Estas son opcionales, pero si quieres que los emails funcionen:

### SMTP_HOST
- **Key**: `SMTP_HOST`
- **Value**: `smtp.gmail.com` (o tu servidor SMTP)

### SMTP_PORT
- **Key**: `SMTP_PORT`
- **Value**: `587`

### SMTP_SECURE
- **Key**: `SMTP_SECURE`
- **Value**: `false`

### SMTP_USER
- **Key**: `SMTP_USER`
- **Value**: Tu email (ej: `tu_email@gmail.com`)

### SMTP_PASS
- **Key**: `SMTP_PASS`
- **Value**: Tu contraseña de aplicación de Gmail
- ⚠️ No es tu contraseña normal, es una "Contraseña de aplicación"

### SMTP_FROM
- **Key**: `SMTP_FROM`
- **Value**: `noreply@volabarato.com` (o tu email)

**Nota:** Estas variables son opcionales. Si no las configuras, los emails no funcionarán, pero el resto de la aplicación sí.

---

## PASO 5: Verificar que los Cambios se Aplicaron

### 5.1. Guardar Cambios
Después de agregar o editar variables:
1. Asegúrate de hacer clic en **"Save"** o **"Save Changes"**
2. Render puede mostrar un mensaje de confirmación

### 5.2. Reinicio Automático
- Render reiniciará automáticamente el servicio cuando cambies variables de entorno
- Esto puede tardar 1-2 minutos
- Verás un mensaje indicando que el servicio se está reiniciando

### 5.3. Verificar en Logs
1. Ve a la pestaña **"Logs"** (menú lateral izquierdo)
2. Busca mensajes que indiquen que el servicio se reinició
3. Verifica que no haya errores relacionados con variables de entorno

---

## ✅ Checklist de Verificación

Marca cada ítem cuando lo verifiques:

- [ ] Accedí a la sección "Environment" en Render
- [ ] Verifiqué que existe `NODE_ENV` con valor `production`
- [ ] Verifiqué que existe `MONGO_URI` con mi connection string correcta
- [ ] Verifiqué que existe `JWT_SECRET` con el valor correcto
- [ ] Verifiqué que `CORS_ORIGIN` está configurada (o no existe, está bien)
- [ ] Verifiqué que NO existe `PORT` (o si existe, no es problema)
- [ ] (Opcional) Configuré las variables de SMTP si quiero que los emails funcionen
- [ ] Guardé todos los cambios
- [ ] El servicio se reinició correctamente
- [ ] Revisé los logs y no hay errores

---

## 🔧 Solución de Problemas

### Problema: No veo la opción "Environment"
**Solución:**
- Asegúrate de estar dentro de tu servicio (no en el dashboard principal)
- Busca en el menú lateral izquierdo
- Si no la ves, intenta refrescar la página

### Problema: No puedo editar una variable
**Solución:**
- Algunas variables pueden estar protegidas
- Intenta hacer clic en "Reveal" primero para ver el valor
- Luego intenta editar

### Problema: El servicio no reinicia después de cambiar variables
**Solución:**
- Espera 1-2 minutos
- Si no se reinicia, ve a "Manual Deploy" → "Deploy latest commit"
- O simplemente espera, Render puede tardar un poco

### Problema: No sé cuál es mi MONGO_URI
**Solución:**
1. Ve a https://cloud.mongodb.com
2. Inicia sesión
3. Selecciona tu cluster
4. Haz clic en "Connect"
5. Selecciona "Connect your application"
6. Copia el connection string
7. Reemplaza `<password>` con tu contraseña real
8. Reemplaza `<dbname>` con `volabarato` (o el nombre de tu base de datos)

---

## 📝 Resumen de Variables Requeridas

```
NODE_ENV = production
MONGO_URI = mongodb+srv://usuario:password@cluster.mongodb.net/volabarato?retryWrites=true&w=majority
JWT_SECRET = 7e8d2a1c307c6b52dc6869ecf193952ae23063544180516f0f414e76f4d8f12cb1370e18c53235e8
CORS_ORIGIN = (temporal o vacío - se actualizará después)
```

---

## 🎯 Próximo Paso

Una vez que hayas verificado todas las variables:

1. ✅ Verifica que el servicio esté funcionando
2. ⏭️ Continúa con el deployment del frontend en Vercel
3. ⏭️ Actualiza `CORS_ORIGIN` con la URL del frontend

---

¿Necesitas ayuda con algún paso específico? ¡Avísame!

