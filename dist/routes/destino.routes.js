"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const destino_controllers_js_1 = require("../controllers/destino.controllers.js");
const router = (0, express_1.Router)();
router.get('/', destino_controllers_js_1.getAllDestinos);
router.get('/search', destino_controllers_js_1.searchDestinos);
router.get('/pais/:pais', destino_controllers_js_1.getDestinosByPais);
router.get('/clima/:clima', destino_controllers_js_1.getDestinosByClima);
router.get('/:id', destino_controllers_js_1.getDestinoById);
router.post('/', destino_controllers_js_1.createDestino);
router.put('/:id', destino_controllers_js_1.updateDestino);
router.delete('/:id', destino_controllers_js_1.deleteDestino);
exports.default = router;
//# sourceMappingURL=destino.routes.js.map