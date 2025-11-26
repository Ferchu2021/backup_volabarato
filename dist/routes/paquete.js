"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Paquete_js_1 = require("../models/Paquete.js");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const paquetes = await Paquete_js_1.Paquete.find({ activo: true }).sort({ fecha: 1 });
        res.json(paquetes);
    }
    catch (error) {
        console.error('Error al obtener paquetes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
router.post('/', async (req, res) => {
    try {
        const { error } = Paquete_js_1.paqueteJoiSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorDetails = error.details.map(detail => ({
                campo: detail.path.join('.'),
                mensaje: detail.message,
                valor: detail.context?.value
            }));
            res.status(400).json({
                error: 'Datos de validación incorrectos',
                message: 'Uno o más campos requeridos no cumplen con los requisitos',
                detalles: errorDetails,
                cantidad_errores: errorDetails.length,
                campos_requeridos: ['nombre', 'destino', 'fecha', 'precio']
            });
            return;
        }
        const paquete = new Paquete_js_1.Paquete(req.body);
        await paquete.save();
        res.status(201).json({
            message: 'Paquete creado exitosamente',
            paquete
        });
    }
    catch (error) {
        console.error('Error al crear paquete:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'Ocurrió un error al procesar la solicitud'
        });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                error: 'ID del paquete es requerido',
                message: 'Proporciona un ID válido en la URL'
            });
            return;
        }
        if (Object.keys(req.body).length === 0) {
            res.status(400).json({
                error: 'No se proporcionaron campos para actualizar',
                message: 'Debes enviar al menos un campo a actualizar',
                campos_disponibles: ['nombre', 'destino', 'fecha', 'precio', 'descripcion', 'activo']
            });
            return;
        }
        const { error } = Paquete_js_1.paqueteUpdateJoiSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorDetails = error.details.map(detail => ({
                campo: detail.path.join('.'),
                mensaje: detail.message,
                valor: detail.context?.value
            }));
            res.status(400).json({
                error: 'Datos de validación incorrectos',
                message: 'Uno o más campos no cumplen con los requisitos',
                detalles: errorDetails,
                cantidad_errores: errorDetails.length
            });
            return;
        }
        const paquete = await Paquete_js_1.Paquete.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!paquete) {
            res.status(404).json({
                error: 'Paquete no encontrado',
                message: `No se encontró un paquete con el ID: ${id}`
            });
            return;
        }
        res.json({
            message: 'Paquete actualizado exitosamente',
            paquete
        });
    }
    catch (error) {
        console.error('Error al actualizar paquete:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'Ocurrió un error al procesar la solicitud'
        });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: 'ID del paquete es requerido' });
            return;
        }
        const paquete = await Paquete_js_1.Paquete.findByIdAndUpdate(id, { activo: false }, { new: true });
        if (!paquete) {
            res.status(404).json({ error: 'Paquete no encontrado' });
            return;
        }
        res.status(200).json({
            message: 'Paquete eliminado exitosamente (baja lógica)',
            paquete
        });
    }
    catch (error) {
        console.error('Error al eliminar paquete:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: 'ID del paquete es requerido' });
            return;
        }
        const paquete = await Paquete_js_1.Paquete.findById(id);
        if (!paquete) {
            res.status(404).json({ error: 'Paquete no encontrado' });
            return;
        }
        if (!paquete.activo) {
            res.status(404).json({ error: 'Paquete no disponible' });
            return;
        }
        res.json(paquete);
    }
    catch (error) {
        console.error('Error al obtener paquete:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.default = router;
//# sourceMappingURL=paquete.js.map