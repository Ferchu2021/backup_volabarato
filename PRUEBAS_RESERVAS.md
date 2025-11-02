# Pruebas de Mejoras de Reservas

## Mejoras Implementadas

### 1. ✅ Número de Reserva Automático
- Campo `numeroReserva` agregado al modelo Reserva
- Formato: `RES-YYYYMMDD-XXXX` (ej: `RES-20241215-0001`)
- Generación automática en el pre-save hook
- Campo único e indexado

### 2. ✅ Usuario desde Token JWT
- El backend obtiene el usuario del token JWT
- Ya no se requiere enviar `usuario` en el body del request
- Validación Joi actualizada (removido campo usuario)

### 3. ✅ Conversión de Monedas
- Utilidad de conversión creada en `src/utils/currency.ts`
- Monedas soportadas: ARS, USD, EUR, BRL
- Selector de moneda en frontend
- Conversión en tiempo real

## Pasos para Probar

### Backend

1. **Reiniciar el servidor** (necesario después de cambios en modelos):
   ```powershell
   # Detener servidor actual (Ctrl+C)
   # Luego ejecutar:
   npm run dev
   ```

2. **Probar creación de reserva**:
   ```powershell
   .\test-reservas-mejoradas.ps1
   ```

3. **Verificar que se genera el número de reserva**:
   - Crear una reserva nueva
   - Verificar que el campo `numeroReserva` esté presente
   - Verificar que tenga formato `RES-YYYYMMDD-XXXX`

4. **Verificar que el usuario se asigna automáticamente**:
   - Crear reserva SIN incluir `usuario` en el body
   - Verificar que el usuario se asigna desde el token JWT

### Frontend

1. **Probar selector de moneda**:
   - Ir a "Mis Reservas" o "Nueva Reserva"
   - Cambiar la moneda seleccionada
   - Verificar que los precios se convierten
   - Verificar que muestra precio original en ARS entre paréntesis

2. **Verificar número de reserva**:
   - Crear una nueva reserva
   - Verificar que aparece el número de reserva en la tarjeta
   - Verificar que aparece en el modal de detalles

3. **Verificar layout mejorado**:
   - Verificar que las tarjetas están mejor organizadas
   - Verificar que el número de reserva es visible
   - Verificar que los precios están bien formateados

## Errores Comunes

### Error 400 al crear reserva
- **Causa**: Servidor no reiniciado después de cambios en modelo
- **Solución**: Reiniciar el servidor con `npm run dev`

### No se genera número de reserva
- **Causa**: Pre-save hook no se ejecuta correctamente
- **Solución**: Verificar que el campo `numeroReserva` esté definido en el schema

### Usuario no se asigna
- **Causa**: Token JWT no se valida correctamente
- **Solución**: Verificar middleware de autenticación y que el token se envía correctamente

## Estructura de Datos

### Reserva en Backend
```typescript
{
  _id: string
  numeroReserva: string  // Nuevo campo
  usuario: ObjectId      // Obtenido del JWT token
  paquete: ObjectId
  fechaReserva: Date
  fechaViaje: Date
  cantidadPersonas: number
  precioTotal: number
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada'
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia'
  observaciones?: string
  datosContacto: {
    nombre: string
    email: string
    telefono: string
  }
}
```

### Request para crear reserva (SIN usuario)
```json
{
  "paquete": "paquete_id",
  "fechaViaje": "2025-01-15",
  "cantidadPersonas": 2,
  "precioTotal": 2400,
  "metodoPago": "tarjeta",
  "observaciones": "Observaciones opcionales",
  "datosContacto": {
    "nombre": "Nombre Completo",
    "email": "email@example.com",
    "telefono": "1234567890"
  }
}
```

