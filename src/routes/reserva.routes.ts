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
import { dualAuth } from '../middlewares/dualAuth.js';
import { firebaseAuth } from '../middlewares/firebaseAuth.js';

const router = Router();

// GET /api/reserva - Obtener todas las reservas (con filtros y paginación)
// Público o protegido según necesidad
router.get('/', getAllReservas);

// GET /api/reserva/stats - Obtener estadísticas de reservas
// Requiere autenticación (JWT o Firebase)
router.get('/stats', dualAuth, getReservasStats);

// GET /api/reserva/mis-reservas - Obtener reservas del usuario autenticado
// Requiere autenticación (JWT o Firebase)
router.get('/mis-reservas', dualAuth, getMisReservas);

// GET /api/reserva/usuario/:usuarioId - Obtener reservas de un usuario específico
// Requiere autenticación (JWT o Firebase)
router.get('/usuario/:usuarioId', dualAuth, getReservasByUsuario);

// GET /api/reserva/:id - Obtener reserva por ID
router.get('/:id', getReservaById);

// POST /api/reserva - Crear nueva reserva
// Requiere autenticación (JWT o Firebase)
router.post('/', dualAuth, createReserva);

// PUT /api/reserva/:id - Actualizar reserva
// Requiere autenticación (JWT o Firebase)
router.put('/:id', dualAuth, updateReserva);

// PUT /api/reserva/:id/cancelar - Cancelar reserva
// Requiere autenticación (JWT o Firebase)
router.put('/:id/cancelar', dualAuth, cancelarReserva);

// PUT /api/reserva/:id/confirmar - Confirmar reserva
// Requiere autenticación (JWT o Firebase)
router.put('/:id/confirmar', dualAuth, confirmarReserva);

// DELETE /api/reserva/:id - Eliminar reserva
// Requiere autenticación (JWT o Firebase)
router.delete('/:id', dualAuth, deleteReserva);

export default router;
