"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const destino_controllers_1 = require("../controllers/destino.controllers");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/', destino_controllers_1.getAllDestinos);
router.get('/search', destino_controllers_1.searchDestinos);
router.get('/pais/:pais', destino_controllers_1.getDestinosByPais);
router.get('/clima/:clima', destino_controllers_1.getDestinosByClima);
router.get('/:id', destino_controllers_1.getDestinoById);
router.post('/', auth_1.auth, destino_controllers_1.createDestino);
router.put('/:id', auth_1.auth, destino_controllers_1.updateDestino);
router.delete('/:id', auth_1.auth, destino_controllers_1.deleteDestino);
exports.default = router;
//# sourceMappingURL=destino.routes.js.map