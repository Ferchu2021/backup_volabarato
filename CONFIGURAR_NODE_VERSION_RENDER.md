# 🔧 Configurar Versión de Node.js en Render

## Versión Recomendada

**Node.js 20.x** (LTS - Long Term Support)

## ¿Por qué Node.js 20?

1. ✅ **Soporte completo para ES Modules**: Tu proyecto usa `"module": "nodenext"` que requiere Node.js 18.17+ o superior
2. ✅ **LTS (Long Term Support)**: Versión estable y con soporte a largo plazo
3. ✅ **Compatible con tus dependencias**: Todas tus dependencias funcionan correctamente con Node.js 20
4. ✅ **Mejor rendimiento**: Node.js 20 tiene mejor rendimiento que versiones anteriores

## Cómo Configurar en Render

### Opción 1: Usar archivo `.nvmrc` (Recomendado)
1. Ya he creado el archivo `.nvmrc` con la versión `20`
2. Render detectará automáticamente este archivo
3. Haz commit y push del archivo `.nvmrc`
4. Render usará Node.js 20 automáticamente en el próximo deploy

### Opción 2: Configurar manualmente en Render
1. Ve a tu servicio en Render Dashboard
2. Ve a **Settings** → **Environment**
3. Busca la sección **Node Version**
4. Selecciona **Node 20** (o escribe `20` en el campo)
5. Guarda los cambios
6. Render hará un redeploy automático

### Opción 3: Usar variable de entorno
1. Ve a **Settings** → **Environment**
2. Agrega una variable de entorno:
   - **Key**: `NODE_VERSION`
   - **Value**: `20`
3. Guarda los cambios

## Verificar la Versión

Después del deploy, puedes verificar la versión en los logs:
```
Node.js v20.x.x
```

## Nota Importante

El archivo `package.json` ahora incluye:
```json
"engines": {
  "node": ">=20.0.0",
  "npm": ">=10.0.0"
}
```

Esto asegura que Render use Node.js 20 o superior.

---

**Después de configurar, haz un redeploy del servicio en Render.**

