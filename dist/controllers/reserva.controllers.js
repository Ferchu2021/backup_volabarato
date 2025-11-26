"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReservasStats = exports.deleteReserva = exports.confirmarReserva = exports.cancelarReserva = exports.updateReserva = exports.createReserva = exports.getReservasByUsuario = exports.getMisReservas = exports.getReservaById = exports.getAllReservas = void 0;
const Reserva_js_1 = require("../models/Reserva.js");
const Paquete_js_1 = require("../models/Paquete.js");
const email_service_js_1 = require("../services/email.service.js");
const getAllReservas = async (req, res) => {
    try {
        const { estado, usuario, paquete, limit = 10, page = 1 } = req.query;
        const filters = {};
        if (estado)
            filters.estado = estado;
        if (usuario)
            filters.usuario = usuario;
        if (paquete)
            filters.paquete = paquete;
        const skip = (Number(page) - 1) * Number(limit);
        const reservas = await Reserva_js_1.Reserva.find(filters)
            .populate('usuario', 'nombre email')
            .populate('paquete', 'nombre destino precio')
            .sort({ fechaReserva: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await Reserva_js_1.Reserva.countDocuments(filters);
        res.json({
            data: reservas,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Error obteniendo reservas:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.getAllReservas = getAllReservas;
const getReservaById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            const errorResponse = {
                error: 'ID de la reserva es requerido'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const reserva = await Reserva_js_1.Reserva.findById(id)
            .populate('usuario', 'nombre email')
            .populate('paquete', 'nombre destino precio');
        if (!reserva) {
            const errorResponse = {
                error: 'Reserva no encontrada'
            };
            res.status(404).json(errorResponse);
            return;
        }
        res.json(reserva);
    }
    catch (error) {
        console.error('Error obteniendo reserva:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.getReservaById = getReservaById;
const getMisReservas = async (req, res) => {
    try {
        const { estado, usuarioId, limit = 10, page = 1 } = req.query;
        if (!usuarioId) {
            const errorResponse = {
                error: 'ID de usuario requerido'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const filters = { usuario: usuarioId };
        if (estado)
            filters.estado = estado;
        const skip = (Number(page) - 1) * Number(limit);
        const reservas = await Reserva_js_1.Reserva.find(filters)
            .populate('paquete', 'nombre destino precio moneda')
            .sort({ fechaReserva: -1 })
            .skip(skip)
            .limit(Number(limit));
        const reservasValidas = reservas.filter((reserva) => reserva.paquete !== null && reserva.paquete !== undefined);
        const total = reservasValidas.length;
        res.json({
            data: reservasValidas,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Error obteniendo mis reservas:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.getMisReservas = getMisReservas;
const getReservasByUsuario = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const { estado, limit = 10, page = 1 } = req.query;
        if (!usuarioId) {
            const errorResponse = {
                error: 'ID del usuario es requerido'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const filters = { usuario: usuarioId };
        if (estado)
            filters.estado = estado;
        const skip = (Number(page) - 1) * Number(limit);
        const reservas = await Reserva_js_1.Reserva.find(filters)
            .populate('paquete', 'nombre destino precio')
            .sort({ fechaReserva: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await Reserva_js_1.Reserva.countDocuments(filters);
        res.json({
            data: reservas,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Error obteniendo reservas del usuario:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.getReservasByUsuario = getReservasByUsuario;
const createReserva = async (req, res) => {
    try {
        const { error } = Reserva_js_1.reservaJoiSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorResponse = {
                error: 'Datos de validación incorrectos',
                details: error.details.map(d => d.message).join('; ') || 'Error de validación',
                message: `Errores de validación: ${error.details.map(d => `${d.path.join('.')}: ${d.message}`).join(', ')}`
            };
            console.error('Error de validación Joi:', JSON.stringify(error.details, null, 2));
            console.error('Body recibido:', JSON.stringify(req.body, null, 2));
            res.status(400).json(errorResponse);
            return;
        }
        const usuarioId = req.body.usuario;
        if (!usuarioId) {
            const errorResponse = {
                error: 'ID de usuario requerido en el body'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const paquete = await Paquete_js_1.Paquete.findById(req.body.paquete);
        if (!paquete) {
            const errorResponse = {
                error: 'Paquete no encontrado'
            };
            res.status(404).json(errorResponse);
            return;
        }
        if (!paquete.activo) {
            const errorResponse = {
                error: 'El paquete no está disponible para reservas'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const fechaViaje = new Date(req.body.fechaViaje);
        if (fechaViaje <= new Date()) {
            const errorResponse = {
                error: 'La fecha de viaje debe ser futura'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const reserva = new Reserva_js_1.Reserva({
            ...req.body,
            usuario: usuarioId
        });
        await reserva.save();
        const reservaPopulada = await Reserva_js_1.Reserva.findById(reserva._id)
            .populate('usuario', 'nombre email')
            .populate('paquete', 'nombre destino precio moneda');
        (0, email_service_js_1.enviarEmailReservaPendiente)(reservaPopulada).catch(error => {
            console.error('Error enviando email de reserva pendiente:', error);
        });
        res.status(201).json({
            message: 'Reserva creada exitosamente',
            reserva: reservaPopulada
        });
    }
    catch (error) {
        console.error('Error creando reserva:', error);
        if (error.code === 11000) {
            const errorResponse = {
                error: 'La reserva ya existe',
                message: 'Intenta con datos diferentes'
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
exports.createReserva = createReserva;
const updateReserva = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            const errorResponse = {
                error: 'ID de la reserva es requerido'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const updateSchema = Reserva_js_1.reservaJoiSchema.fork(Object.keys(Reserva_js_1.reservaJoiSchema.describe().keys), (schema) => schema.optional());
        const { error } = updateSchema.validate(req.body);
        if (error) {
            const errorResponse = {
                error: 'Datos de validación incorrectos',
                details: error.details[0]?.message || 'Error de validación'
            };
            res.status(400).json(errorResponse);
            return;
        }
        if (req.body.fechaViaje) {
            const fechaViaje = new Date(req.body.fechaViaje);
            if (fechaViaje <= new Date()) {
                const errorResponse = {
                    error: 'La fecha de viaje debe ser futura'
                };
                res.status(400).json(errorResponse);
                return;
            }
        }
        const reserva = await Reserva_js_1.Reserva.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
            .populate('usuario', 'nombre email')
            .populate('paquete', 'nombre destino precio');
        if (!reserva) {
            const errorResponse = {
                error: 'Reserva no encontrada'
            };
            res.status(404).json(errorResponse);
            return;
        }
        res.json({
            message: 'Reserva actualizada exitosamente',
            reserva
        });
    }
    catch (error) {
        console.error('Error actualizando reserva:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.updateReserva = updateReserva;
const cancelarReserva = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            const errorResponse = {
                error: 'ID de la reserva es requerido'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const reserva = await Reserva_js_1.Reserva.findByIdAndUpdate(id, { estado: 'cancelada' }, { new: true })
            .populate('usuario', 'nombre email')
            .populate('paquete', 'nombre destino precio');
        if (!reserva) {
            const errorResponse = {
                error: 'Reserva no encontrada'
            };
            res.status(404).json(errorResponse);
            return;
        }
        res.json({
            message: 'Reserva cancelada exitosamente',
            reserva
        });
    }
    catch (error) {
        console.error('Error cancelando reserva:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.cancelarReserva = cancelarReserva;
const confirmarReserva = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            const errorResponse = {
                error: 'ID de la reserva es requerido'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const reserva = await Reserva_js_1.Reserva.findByIdAndUpdate(id, { estado: 'confirmada' }, { new: true })
            .populate('usuario', 'nombre email')
            .populate('paquete', 'nombre destino precio moneda');
        if (!reserva) {
            const errorResponse = {
                error: 'Reserva no encontrada'
            };
            res.status(404).json(errorResponse);
            return;
        }
        (0, email_service_js_1.enviarEmailConfirmacion)(reserva).catch(error => {
            console.error('Error enviando email de confirmación:', error);
        });
        res.json({
            message: 'Reserva confirmada exitosamente. Se ha enviado un email de confirmación.',
            reserva
        });
    }
    catch (error) {
        console.error('Error confirmando reserva:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.confirmarReserva = confirmarReserva;
const deleteReserva = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            const errorResponse = {
                error: 'ID de la reserva es requerido'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const reserva = await Reserva_js_1.Reserva.findByIdAndDelete(id);
        if (!reserva) {
            const errorResponse = {
                error: 'Reserva no encontrada'
            };
            res.status(404).json(errorResponse);
            return;
        }
        res.json({
            message: 'Reserva eliminada exitosamente',
            reserva
        });
    }
    catch (error) {
        console.error('Error eliminando reserva:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.deleteReserva = deleteReserva;
const getReservasStats = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        const filters = {};
        if (fechaInicio && fechaFin) {
            filters.fechaReserva = {
                $gte: new Date(fechaInicio),
                $lte: new Date(fechaFin)
            };
        }
        const stats = await Reserva_js_1.Reserva.aggregate([
            { $match: filters },
            {
                $group: {
                    _id: '$estado',
                    count: { $sum: 1 },
                    totalIngresos: { $sum: '$precioTotal' }
                }
            }
        ]);
        const totalReservas = await Reserva_js_1.Reserva.countDocuments(filters);
        const totalIngresos = await Reserva_js_1.Reserva.aggregate([
            { $match: filters },
            { $group: { _id: null, total: { $sum: '$precioTotal' } } }
        ]);
        res.json({
            estadisticas: stats,
            totalReservas,
            totalIngresos: totalIngresos[0]?.total || 0
        });
    }
    catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.getReservasStats = getReservasStats;
exports.default = {
    getAllReservas: exports.getAllReservas,
    getReservaById: exports.getReservaById,
    getReservasByUsuario: exports.getReservasByUsuario,
    getMisReservas: exports.getMisReservas,
    createReserva: exports.createReserva,
    updateReserva: exports.updateReserva,
    cancelarReserva: exports.cancelarReserva,
    confirmarReserva: exports.confirmarReserva,
    deleteReserva: exports.deleteReserva,
    getReservasStats: exports.getReservasStats
};
//# sourceMappingURL=reserva.controllers.js.map