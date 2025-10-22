"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const destino_controllers_1 = require("../controllers/destino.controllers");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// GET /api/destino - Obtener todos los destinos (con filtros y paginación)
router.get('/', destino_controllers_1.getAllDestinos);
// GET /api/destino/search - Buscar destinos
router.get('/search', destino_controllers_1.searchDestinos);
// GET /api/destino/pais/:pais - Obtener destinos por país
router.get('/pais/:pais', destino_controllers_1.getDestinosByPais);
// GET /api/destino/clima/:clima - Obtener destinos por clima
router.get('/clima/:clima', destino_controllers_1.getDestinosByClima);
// GET /api/destino/:id - Obtener destino por ID
router.get('/:id', destino_controllers_1.getDestinoById);
// POST /api/destino - Crear nuevo destino (requiere autenticación)
router.post('/', auth_1.auth, destino_controllers_1.createDestino);
// PUT /api/destino/:id - Actualizar destino (requiere autenticación)
router.put('/:id', auth_1.auth, destino_controllers_1.updateDestino);
// DELETE /api/destino/:id - Eliminar destino (requiere autenticación)
router.delete('/:id', auth_1.auth, destino_controllers_1.deleteDestino);
exports.default = router;
//# sourceMappingURL=destino.routes.js.map