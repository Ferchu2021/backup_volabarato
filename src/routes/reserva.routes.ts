import { Router } from 'express';
import { 
  getAllReservas, 
  getReservaById, 
  getReservasByUsuario,
  getMisReservas,
  createReserva, 
  updateReserva, 
  cancelarReserva,
  confirmarReserva,
  deleteReserva,
  getReservasStats
} from '../controllers/reserva.controllers.js';

const router = Router();

// GET /api/reserva - Obtener todas las reservas (con filtros y paginación)
router.get('/', getAllReservas);

// GET /api/reserva/stats - Obtener estadísticas de reservas
router.get('/stats', getReservasStats);

// GET /api/reserva/mis-reservas - Obtener reservas del usuario autenticado
router.get('/mis-reservas', getMisReservas);

// GET /api/reserva/usuario/:usuarioId - Obtener reservas de un usuario específico
router.get('/usuario/:usuarioId', getReservasByUsuario);

// GET /api/reserva/:id - Obtener reserva por ID
router.get('/:id', getReservaById);

// POST /api/reserva - Crear nueva reserva
router.post('/', createReserva);

// PUT /api/reserva/:id - Actualizar reserva
router.put('/:id', updateReserva);

// PUT /api/reserva/:id/cancelar - Cancelar reserva
router.put('/:id/cancelar', cancelarReserva);

// PUT /api/reserva/:id/confirmar - Confirmar reserva
router.put('/:id/confirmar', confirmarReserva);

// DELETE /api/reserva/:id - Eliminar reserva
router.delete('/:id', deleteReserva);

export default router;
