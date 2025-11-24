# 🔄 Actualizar CORS en Render - Después del Deploy

## ⚡ Inicio Rápido (2 minutos)

### Paso 1: Obtener URL de Vercel
1. Ve a tu proyecto en Vercel
2. Copia la URL de producción (ej: `https://volabarato-xxxxx.vercel.app`)

### Paso 2: Ir a Render
1. Abre: https://render.com
2. Inicia sesión
3. Selecciona el servicio: **`backup-volabarato-1`**

### Paso 3: Actualizar CORS_ORIGIN
1. Ve a la pestaña **"Environment"**
2. Busca la variable: **`CORS_ORIGIN`**
3. Haz clic en el valor actual para editarlo
4. Reemplaza con la URL de Vercel:

```
https://volabarato-xxxxx.vercel.app,https://www.volabarato-xxxxx.vercel.app
```

**⚠️ IMPORTANTE**:
- Reemplaza `volabarato-xxxxx` con tu URL real de Vercel
- No incluyas espacios
- Separa múltiples URLs con comas
- Si tienes un dominio personalizado, agrégalo también

### Paso 4: Guardar
1. Haz clic en **"Save Changes"**
2. Render reiniciará automáticamente el servicio
3. Espera 1-2 minutos

### Paso 5: Verificar
1. Abre el frontend en Vercel
2. Abre la consola del navegador (F12)
3. Verifica que no haya errores de CORS
4. Las peticiones al backend deben funcionar

---

## ✅ Checklist

- [ ] URL de Vercel obtenida
- [ ] Render abierto
- [ ] Servicio `backup-volabarato-1` seleccionado
- [ ] Variable `CORS_ORIGIN` actualizada
- [ ] Cambios guardados
- [ ] Servicio reiniciado
- [ ] Verificación realizada

---

## 🔧 Solución de Problemas

### Error: "CORS policy blocked"
- **Causa**: URL no incluida en `CORS_ORIGIN`
- **Solución**: Verifica que la URL exacta esté en `CORS_ORIGIN`

### Error: "Multiple origins"
- **Causa**: Formato incorrecto
- **Solución**: Separa con comas, sin espacios: `url1,url2`

### El servicio no se reinicia
- **Causa**: Render puede tardar
- **Solución**: Espera 2-3 minutos o haz un "Manual Deploy"

---

## 📝 Notas

- Render reinicia automáticamente después de cambiar variables
- Puede tardar 1-2 minutos en aplicar los cambios
- Verifica siempre en la consola del navegador

---

**¡Listo! Actualiza CORS en 2 minutos.** 🔄

