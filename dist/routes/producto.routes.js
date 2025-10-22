"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const producto_controllers_1 = require("../controllers/producto.controllers");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// GET /api/producto - Obtener todos los productos (con filtros y paginación)
router.get('/', producto_controllers_1.getAllProductos);
// GET /api/producto/search - Buscar productos
router.get('/search', producto_controllers_1.searchProductos);
// GET /api/producto/:id - Obtener producto por ID
router.get('/:id', producto_controllers_1.getProductoById);
// POST /api/producto - Crear nuevo producto (requiere autenticación)
router.post('/', auth_1.auth, producto_controllers_1.createProducto);
// PUT /api/producto/:id - Actualizar producto (requiere autenticación)
router.put('/:id', auth_1.auth, producto_controllers_1.updateProducto);
// DELETE /api/producto/:id - Eliminar producto (requiere autenticación)
router.delete('/:id', auth_1.auth, producto_controllers_1.deleteProducto);
exports.default = router;
//# sourceMappingURL=producto.routes.js.map