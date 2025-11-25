# 🔧 Actualizar CORS en Render

## Problema
El frontend en Vercel (https://frontend-volabarato.vercel.app) no puede acceder al backend debido a CORS.

## Solución

### Opción 1: Configurar Variable de Entorno en Render (Recomendado)

1. Ve a **Render Dashboard** → tu servicio "backup-volabarato-1"
2. Ve a **Settings** → **Environment**
3. Busca o crea la variable de entorno:
   - **Key**: `CORS_ORIGIN`
   - **Value**: `https://frontend-volabarato.vercel.app,https://volabarato.vercel.app`
4. Guarda los cambios
5. Render hará un redeploy automático

### Opción 2: Usar los valores por defecto

El código ahora incluye URLs por defecto para producción:
- `https://frontend-volabarato.vercel.app`
- `https://volabarato.vercel.app`

Si no configuras `CORS_ORIGIN`, se usarán estas URLs automáticamente.

## Verificar

Después del redeploy, el frontend debería poder acceder al backend sin errores de CORS.

---

**Nota**: Si tienes otras URLs de frontend (preview, staging, etc.), agrégalas separadas por comas en `CORS_ORIGIN`.
