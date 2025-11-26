"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reserva_controllers_js_1 = require("../controllers/reserva.controllers.js");
const router = (0, express_1.Router)();
router.get('/', reserva_controllers_js_1.getAllReservas);
router.get('/stats', reserva_controllers_js_1.getReservasStats);
router.get('/mis-reservas', reserva_controllers_js_1.getMisReservas);
router.get('/usuario/:usuarioId', reserva_controllers_js_1.getReservasByUsuario);
router.get('/:id', reserva_controllers_js_1.getReservaById);
router.post('/', reserva_controllers_js_1.createReserva);
router.put('/:id', reserva_controllers_js_1.updateReserva);
router.put('/:id/cancelar', reserva_controllers_js_1.cancelarReserva);
router.put('/:id/confirmar', reserva_controllers_js_1.confirmarReserva);
router.delete('/:id', reserva_controllers_js_1.deleteReserva);
exports.default = router;
//# sourceMappingURL=reserva.routes.js.map