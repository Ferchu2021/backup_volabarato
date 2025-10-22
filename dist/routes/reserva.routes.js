"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reserva_controllers_1 = require("../controllers/reserva.controllers");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// GET /api/reserva - Obtener todas las reservas (con filtros y paginación)
router.get('/', reserva_controllers_1.getAllReservas);
// GET /api/reserva/stats - Obtener estadísticas de reservas
router.get('/stats', reserva_controllers_1.getReservasStats);
// GET /api/reserva/mis-reservas - Obtener reservas del usuario autenticado
router.get('/mis-reservas', auth_1.auth, reserva_controllers_1.getMisReservas);
// GET /api/reserva/usuario/:usuarioId - Obtener reservas de un usuario específico
router.get('/usuario/:usuarioId', reserva_controllers_1.getReservasByUsuario);
// GET /api/reserva/:id - Obtener reserva por ID
router.get('/:id', reserva_controllers_1.getReservaById);
// POST /api/reserva - Crear nueva reserva (requiere autenticación)
router.post('/', auth_1.auth, reserva_controllers_1.createReserva);
// PUT /api/reserva/:id - Actualizar reserva (requiere autenticación)
router.put('/:id', auth_1.auth, reserva_controllers_1.updateReserva);
// PUT /api/reserva/:id/cancelar - Cancelar reserva (requiere autenticación)
router.put('/:id/cancelar', auth_1.auth, reserva_controllers_1.cancelarReserva);
// PUT /api/reserva/:id/confirmar - Confirmar reserva (requiere autenticación)
router.put('/:id/confirmar', auth_1.auth, reserva_controllers_1.confirmarReserva);
// DELETE /api/reserva/:id - Eliminar reserva (requiere autenticación)
router.delete('/:id', auth_1.auth, reserva_controllers_1.deleteReserva);
exports.default = router;
//# sourceMappingURL=reserva.routes.js.map