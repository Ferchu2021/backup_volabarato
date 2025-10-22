"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reserva_controllers_1 = require("../controllers/reserva.controllers");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/', reserva_controllers_1.getAllReservas);
router.get('/stats', reserva_controllers_1.getReservasStats);
router.get('/mis-reservas', auth_1.auth, reserva_controllers_1.getMisReservas);
router.get('/usuario/:usuarioId', reserva_controllers_1.getReservasByUsuario);
router.get('/:id', reserva_controllers_1.getReservaById);
router.post('/', auth_1.auth, reserva_controllers_1.createReserva);
router.put('/:id', auth_1.auth, reserva_controllers_1.updateReserva);
router.put('/:id/cancelar', auth_1.auth, reserva_controllers_1.cancelarReserva);
router.put('/:id/confirmar', auth_1.auth, reserva_controllers_1.confirmarReserva);
router.delete('/:id', auth_1.auth, reserva_controllers_1.deleteReserva);
exports.default = router;
//# sourceMappingURL=reserva.routes.js.map