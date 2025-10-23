"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProductos = exports.deleteProducto = exports.updateProducto = exports.createProducto = exports.getProductoById = exports.getAllProductos = void 0;
const Producto_1 = require("../models/Producto");
const getAllProductos = async (req, res) => {
    try {
        const { categoria, activo, limit = 10, page = 1 } = req.query;
        const filters = {};
        if (categoria)
            filters.categoria = categoria;
        if (activo !== undefined)
            filters.activo = activo === 'true';
        const skip = (Number(page) - 1) * Number(limit);
        const productos = await Producto_1.Producto.find(filters)
            .sort({ fechaCreacion: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await Producto_1.Producto.countDocuments(filters);
        res.json({
            productos,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Error obteniendo productos:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.getAllProductos = getAllProductos;
const getProductoById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            const errorResponse = {
                error: 'ID del producto es requerido'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const producto = await Producto_1.Producto.findById(id);
        if (!producto) {
            const errorResponse = {
                error: 'Producto no encontrado'
            };
            res.status(404).json(errorResponse);
            return;
        }
        res.json(producto);
    }
    catch (error) {
        console.error('Error obteniendo producto:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.getProductoById = getProductoById;
const createProducto = async (req, res) => {
    try {
        const { error } = Producto_1.productoJoiSchema.validate(req.body);
        if (error) {
            const errorResponse = {
                error: 'Datos de validación incorrectos',
                details: error.details[0]?.message || 'Error de validación'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const producto = new Producto_1.Producto(req.body);
        await producto.save();
        res.status(201).json({
            message: 'Producto creado exitosamente',
            producto
        });
    }
    catch (error) {
        console.error('Error creando producto:', error);
        if (error.code === 11000) {
            const errorResponse = {
                error: 'El producto ya existe',
                message: 'Intenta con un nombre diferente'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.createProducto = createProducto;
const updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            const errorResponse = {
                error: 'ID del producto es requerido'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const { error } = Producto_1.productoJoiSchema.validate(req.body);
        if (error) {
            const errorResponse = {
                error: 'Datos de validación incorrectos',
                details: error.details[0]?.message || 'Error de validación'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const producto = await Producto_1.Producto.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!producto) {
            const errorResponse = {
                error: 'Producto no encontrado'
            };
            res.status(404).json(errorResponse);
            return;
        }
        res.json({
            message: 'Producto actualizado exitosamente',
            producto
        });
    }
    catch (error) {
        console.error('Error actualizando producto:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.updateProducto = updateProducto;
const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            const errorResponse = {
                error: 'ID del producto es requerido'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const producto = await Producto_1.Producto.findByIdAndUpdate(id, { activo: false }, { new: true });
        if (!producto) {
            const errorResponse = {
                error: 'Producto no encontrado'
            };
            res.status(404).json(errorResponse);
            return;
        }
        res.json({
            message: 'Producto eliminado exitosamente (baja lógica)',
            producto
        });
    }
    catch (error) {
        console.error('Error eliminando producto:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.deleteProducto = deleteProducto;
const searchProductos = async (req, res) => {
    try {
        const { q, categoria, precioMin, precioMax } = req.query;
        if (!q) {
            const errorResponse = {
                error: 'Término de búsqueda es requerido'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const filters = {
            $or: [
                { nombre: { $regex: q, $options: 'i' } },
                { descripcion: { $regex: q, $options: 'i' } },
                { categoria: { $regex: q, $options: 'i' } }
            ],
            activo: true
        };
        if (categoria)
            filters.categoria = categoria;
        if (precioMin || precioMax) {
            filters.precio = {};
            if (precioMin)
                filters.precio.$gte = Number(precioMin);
            if (precioMax)
                filters.precio.$lte = Number(precioMax);
        }
        const productos = await Producto_1.Producto.find(filters).sort({ fechaCreacion: -1 });
        res.json({
            productos,
            total: productos.length,
            query: q
        });
    }
    catch (error) {
        console.error('Error buscando productos:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.searchProductos = searchProductos;
exports.default = {
    getAllProductos: exports.getAllProductos,
    getProductoById: exports.getProductoById,
    createProducto: exports.createProducto,
    updateProducto: exports.updateProducto,
    deleteProducto: exports.deleteProducto,
    searchProductos: exports.searchProductos
};
//# sourceMappingURL=producto.controllers.js.map