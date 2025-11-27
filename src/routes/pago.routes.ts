import { Router } from 'express';
import { 
  getAllPagos, 
  getPagoById, 
  getPagoByReserva,
  createPago, 
  updatePago,
  completarPago,
  deletePago
} from '../controllers/pago.controllers.js';
import { dualAuth } from '../middlewares/dualAuth.js';

const router = Router();

// GET /api/pago - Obtener todos los pagos (con filtros y paginación)
router.get('/', dualAuth, getAllPagos);

// GET /api/pago/reserva/:reservaId - Obtener pago por ID de reserva
router.get('/reserva/:reservaId', dualAuth, getPagoByReserva);

// GET /api/pago/:id - Obtener pago por ID
router.get('/:id', dualAuth, getPagoById);

// POST /api/pago - Crear nuevo pago (requiere autenticación)
router.post('/', dualAuth, createPago);

// PUT /api/pago/:id - Actualizar pago (requiere autenticación)
router.put('/:id', dualAuth, updatePago);

// PUT /api/pago/:id/completar - Completar pago (requiere autenticación)
router.put('/:id/completar', dualAuth, completarPago);

// DELETE /api/pago/:id - Eliminar pago (requiere autenticación)
router.delete('/:id', dualAuth, deletePago);

export default router;

