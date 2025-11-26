"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const producto_controllers_js_1 = require("../controllers/producto.controllers.js");
const router = (0, express_1.Router)();
router.get('/', producto_controllers_js_1.getAllProductos);
router.get('/search', producto_controllers_js_1.searchProductos);
router.get('/:id', producto_controllers_js_1.getProductoById);
router.post('/', producto_controllers_js_1.createProducto);
router.put('/:id', producto_controllers_js_1.updateProducto);
router.delete('/:id', producto_controllers_js_1.deleteProducto);
exports.default = router;
//# sourceMappingURL=producto.routes.js.map