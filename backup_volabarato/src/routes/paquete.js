"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Paquete_1 = require("../models/Paquete");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// GET /api/paquete - Obtener todos los paquetes activos
router.get('/', async (req, res) => {
    try {
        const paquetes = await Paquete_1.Paquete.find({ activo: true }).sort({ fecha: 1 });
        res.json(paquetes);
    }
    catch (error) {
        console.error('Error al obtener paquetes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
// POST /api/paquete - Crear nuevo paquete (requiere autenticación)
router.post('/', auth_1.auth, async (req, res) => {
    try {
        const { error } = Paquete_1.paqueteJoiSchema.validate(req.body);
        if (error) {
            res.status(400).json({
                error: 'Datos de validación incorrectos',
                details: error.details[0]?.message || 'Error de validación'
            });
            return;
        }
        const paquete = new Paquete_1.Paquete(req.body);
        await paquete.save();
        res.status(201).json({
            message: 'Paquete creado exitosamente',
            paquete
        });
    }
    catch (error) {
        console.error('Error al crear paquete:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
// PUT /api/paquete/:id - Actualizar paquete (requiere autenticación)
router.put('/:id', auth_1.auth, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: 'ID del paquete es requerido' });
            return;
        }
        const { error } = Paquete_1.paqueteJoiSchema.validate(req.body);
        if (error) {
            res.status(400).json({
                error: 'Datos de validación incorrectos',
                details: error.details[0]?.message || 'Error de validación'
            });
            return;
        }
        const paquete = await Paquete_1.Paquete.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!paquete) {
            res.status(404).json({ error: 'Paquete no encontrado' });
            return;
        }
        res.json({
            message: 'Paquete actualizado exitosamente',
            paquete
        });
    }
    catch (error) {
        console.error('Error al actualizar paquete:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
// DELETE /api/paquete/:id - Eliminar paquete (baja lógica, requiere autenticación)
router.delete('/:id', auth_1.auth, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: 'ID del paquete es requerido' });
            return;
        }
        const paquete = await Paquete_1.Paquete.findByIdAndUpdate(id, { activo: false }, { new: true });
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
// GET /api/paquete/:id - Obtener paquete por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: 'ID del paquete es requerido' });
            return;
        }
        const paquete = await Paquete_1.Paquete.findById(id);
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