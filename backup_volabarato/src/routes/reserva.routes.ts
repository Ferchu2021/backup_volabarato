import { Router } from 'express';
import { 
  getAllReservas, 
  getReservaById, 
  getReservasByUsuario,
  createReserva, 
  updateReserva, 
  cancelarReserva,
  confirmarReserva,
  deleteReserva,
  getReservasStats
} from '../controllers/reserva.controllers';
import { auth } from '../middlewares/auth';

const router = Router();

// GET /api/reserva - Obtener todas las reservas (con filtros y paginación)
router.get('/', getAllReservas);

// GET /api/reserva/stats - Obtener estadísticas de reservas
router.get('/stats', getReservasStats);

// GET /api/reserva/usuario/:usuarioId - Obtener reservas de un usuario específico
router.get('/usuario/:usuarioId', getReservasByUsuario);

// GET /api/reserva/:id - Obtener reserva por ID
router.get('/:id', getReservaById);

// POST /api/reserva - Crear nueva reserva (requiere autenticación)
router.post('/', auth, createReserva);

// PUT /api/reserva/:id - Actualizar reserva (requiere autenticación)
router.put('/:id', auth, updateReserva);

// PUT /api/reserva/:id/cancelar - Cancelar reserva (requiere autenticación)
router.put('/:id/cancelar', auth, cancelarReserva);

// PUT /api/reserva/:id/confirmar - Confirmar reserva (requiere autenticación)
router.put('/:id/confirmar', auth, confirmarReserva);

// DELETE /api/reserva/:id - Eliminar reserva (requiere autenticación)
router.delete('/:id', auth, deleteReserva);

export default router;
