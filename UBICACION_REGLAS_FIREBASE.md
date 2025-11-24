# 📍 Dónde Configurar las Reglas de Firebase Storage

## ⚠️ IMPORTANTE: NO es en el código SDK

El código SDK que estás viendo es para **configurar Firebase en el frontend** (ya está hecho ✅).

Las **reglas de Storage** van en una **sección diferente** de Firebase Console.

---

## ✅ Pasos Correctos

### Paso 1: Salir de "Project Settings"
- Estás en: **Configuración de proyecto** (Project Settings)
- **NO** es aquí donde van las reglas

### Paso 2: Ir a Storage
1. En el **menú lateral izquierdo**, busca **"Storage"** (con icono de nube ☁️)
2. Haz clic en **"Storage"**

### Paso 3: Ir a la pestaña "Rules"
1. Una vez en Storage, verás varias pestañas en la parte superior:
   - **"Files"** o **"Archivos"** (muestra las imágenes subidas)
   - **"Rules"** o **"Reglas"** ← **AQUÍ es donde van las reglas**
2. Haz clic en la pestaña **"Rules"** o **"Reglas"**

### Paso 4: Ver el Editor de Reglas
- Verás un editor de código con reglas actuales (probablemente en modo test)
- Este es el lugar correcto para pegar las reglas

### Paso 5: Pegar las Reglas
1. Copia el código de `REGLAS_FIREBASE_STORAGE_PRODUCCION.txt`
2. Reemplaza todo el código en el editor
3. Haz clic en **"Publish"** o **"Publicar"**

---

## 📍 Resumen de Ubicación

```
Firebase Console
├── Configuración de proyecto (Project Settings) ← Estás aquí
│   └── Código SDK (para frontend) ✅ Ya configurado
│
└── Storage ← Ve aquí
    └── Rules (Reglas) ← AQUÍ van las reglas de Storage
```

---

## 🎯 Ruta Visual

1. **Menú lateral izquierdo** → Busca **"Storage"** (icono ☁️)
2. Haz clic en **"Storage"**
3. Pestaña superior → Haz clic en **"Rules"** o **"Reglas"**
4. **Editor de código** → Pega las reglas aquí
5. **Botón "Publish"** → Publica las reglas

---

## ✅ Checklist

- [ ] Salir de "Project Settings"
- [ ] Ir a "Storage" en el menú lateral
- [ ] Ir a la pestaña "Rules"
- [ ] Ver el editor de reglas
- [ ] Pegar el código de reglas
- [ ] Publicar las reglas

---

## 🔍 Si no ves "Storage" en el menú

1. Verifica que Firebase Storage esté habilitado
2. Si no está habilitado:
   - Ve a Storage
   - Haz clic en "Get started" o "Comenzar"
   - Acepta los términos
   - Luego verás la pestaña "Rules"

---

**Las reglas NO van en el código SDK, van en Storage → Rules** 📍

