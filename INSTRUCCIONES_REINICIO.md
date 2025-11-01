# 🔄 Instrucciones para Reiniciar el Servidor

## ⚠️ IMPORTANTE: Reinicio Requerido

Los cambios que se han realizado necesitan que el servidor se reinicie para aplicarse correctamente.

## 📋 Pasos para Reiniciar el Servidor

### Si el servidor está corriendo con `nodemon` (npm run dev):

1. **Detén el servidor** presionando `Ctrl+C` en la terminal donde está corriendo
2. **Reinicia el servidor** ejecutando:
   ```bash
   npm run dev
   ```

### Si el servidor está corriendo con `npm start` (versión compilada):

1. **Detén el servidor** presionando `Ctrl+C` en la terminal donde está corriendo
2. **Recompila el código** (si es necesario):
   ```bash
   npm run build
   ```
3. **Reinicia el servidor**:
   ```bash
   npm start
   ```

## ✅ Verificación

Después de reiniciar, puedes verificar que los cambios funcionan probando:

```bash
# Obtener token
curl -X POST http://localhost:4000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"fernanda","password":"123456.a"}'

# Probar PUT con actualización parcial
# (reemplaza TOKEN y PAQUETE_ID con valores reales)
curl -X PUT http://localhost:4000/api/paquete/PAQUETE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"precio":2000}'
```

O ejecuta el script de pruebas:
```powershell
.\test-endpoints-fixed.ps1
```

## 🎯 Cambios que se Aplicarán

1. ✅ Endpoints PUT ahora permiten actualizaciones parciales
2. ✅ Mensajes de error mejorados y más descriptivos
3. ✅ Validación con esquemas separados para crear/actualizar

