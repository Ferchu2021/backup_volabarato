"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const producto_controllers_1 = require("../controllers/producto.controllers");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/', producto_controllers_1.getAllProductos);
router.get('/search', producto_controllers_1.searchProductos);
router.get('/:id', producto_controllers_1.getProductoById);
router.post('/', auth_1.auth, producto_controllers_1.createProducto);
router.put('/:id', auth_1.auth, producto_controllers_1.updateProducto);
router.delete('/:id', auth_1.auth, producto_controllers_1.deleteProducto);
exports.default = router;
//# sourceMappingURL=producto.routes.js.map