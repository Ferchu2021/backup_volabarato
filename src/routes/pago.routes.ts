import { Router } from 'express';
import { 
  getAllPagos, 
  getPagoById, 
  getPagoByReserva,
  createPago, 
  updatePago,
  completarPago,
  deletePago
} from '../controllers/pago.controllers';

const router = Router();

// GET /api/pago - Obtener todos los pagos (con filtros y paginación)
router.get('/', getAllPagos);

// GET /api/pago/reserva/:reservaId - Obtener pago por ID de reserva
router.get('/reserva/:reservaId', getPagoByReserva);

// GET /api/pago/:id - Obtener pago por ID
router.get('/:id', getPagoById);

// POST /api/pago - Crear nuevo pago
router.post('/', createPago);

// PUT /api/pago/:id - Actualizar pago
router.put('/:id', updatePago);

// PUT /api/pago/:id/completar - Completar pago
router.put('/:id/completar', completarPago);

// DELETE /api/pago/:id - Eliminar pago
router.delete('/:id', deletePago);

export default router;

