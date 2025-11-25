# 🔧 Configurar Build Command en Render

## Problema
Render no está instalando `devDependencies` durante el build, lo que causa errores de TypeScript porque faltan los tipos (`@types/*`).

## Solución

### Opción 1: Configurar Build Command en Render Dashboard (Recomendado)

1. Ve a **Render Dashboard** → tu servicio
2. Ve a **Settings** → **Build & Deploy**
3. En **Build Command**, cambia a:
   ```
   npm ci && npm run build
   ```
4. Guarda los cambios
5. Haz un redeploy

### Opción 2: Usar archivo `render.yaml` (Ya configurado)

El archivo `render.yaml` ya está configurado con:
```yaml
buildCommand: npm ci && npm run build
```

Render debería detectarlo automáticamente.

## ¿Por qué `npm ci`?

- `npm ci` instala TODAS las dependencias (incluyendo devDependencies) basándose en `package-lock.json`
- Es más rápido y confiable que `npm install` en CI/CD
- Instala exactamente las versiones especificadas

## Verificar

Después del deploy, en los logs deberías ver:
```
Running npm ci
Installing dependencies...
Running npm run build
Running tsc
```

Y NO deberías ver errores de tipos faltantes.

---

**Nota**: Si Render no detecta el archivo `render.yaml`, usa la Opción 1 para configurarlo manualmente.

