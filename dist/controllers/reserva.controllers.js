"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReservasStats = exports.deleteReserva = exports.confirmarReserva = exports.cancelarReserva = exports.updateReserva = exports.createReserva = exports.getReservasByUsuario = exports.getMisReservas = exports.getReservaById = exports.getAllReservas = void 0;
const Reserva_1 = require("../models/Reserva");
const Paquete_1 = require("../models/Paquete");
// Controller para obtener todas las reservas
const getAllReservas = async (req, res) => {
    try {
        const { estado, usuario, paquete, limit = 10, page = 1 } = req.query;
        // Construir filtros
        const filters = {};
        if (estado)
            filters.estado = estado;
        if (usuario)
            filters.usuario = usuario;
        if (paquete)
            filters.paquete = paquete;
        // Paginación
        const skip = (Number(page) - 1) * Number(limit);
        const reservas = await Reserva_1.Reserva.find(filters)
            .populate('usuario', 'nombre email')
            .populate('paquete', 'nombre destino precio')
            .sort({ fechaReserva: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await Reserva_1.Reserva.countDocuments(filters);
        res.json({
            reservas,
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
// Controller para obtener una reserva por ID
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
        const reserva = await Reserva_1.Reserva.findById(id)
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
// Controller para obtener reservas del usuario autenticado
const getMisReservas = async (req, res) => {
    try {
        const { estado, limit = 10, page = 1 } = req.query;
        // Obtener el ID del usuario desde el token JWT
        const usuarioId = req.user?._id;
        if (!usuarioId) {
            const errorResponse = {
                error: 'Usuario no autenticado'
            };
            res.status(401).json(errorResponse);
            return;
        }
        // Construir filtros
        const filters = { usuario: usuarioId };
        if (estado)
            filters.estado = estado;
        // Paginación
        const skip = (Number(page) - 1) * Number(limit);
        const reservas = await Reserva_1.Reserva.find(filters)
            .populate('paquete', 'nombre destino precio')
            .sort({ fechaReserva: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await Reserva_1.Reserva.countDocuments(filters);
        res.json({
            reservas,
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
// Controller para obtener reservas de un usuario específico
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
        // Construir filtros
        const filters = { usuario: usuarioId };
        if (estado)
            filters.estado = estado;
        // Paginación
        const skip = (Number(page) - 1) * Number(limit);
        const reservas = await Reserva_1.Reserva.find(filters)
            .populate('paquete', 'nombre destino precio')
            .sort({ fechaReserva: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await Reserva_1.Reserva.countDocuments(filters);
        res.json({
            reservas,
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
// Controller para crear una nueva reserva
const createReserva = async (req, res) => {
    try {
        const { error } = Reserva_1.reservaJoiSchema.validate(req.body);
        if (error) {
            const errorResponse = {
                error: 'Datos de validación incorrectos',
                details: error.details[0]?.message || 'Error de validación'
            };
            res.status(400).json(errorResponse);
            return;
        }
        // Verificar que el paquete existe
        const paquete = await Paquete_1.Paquete.findById(req.body.paquete);
        if (!paquete) {
            const errorResponse = {
                error: 'Paquete no encontrado'
            };
            res.status(404).json(errorResponse);
            return;
        }
        // Verificar que el paquete está activo
        if (!paquete.activo) {
            const errorResponse = {
                error: 'El paquete no está disponible para reservas'
            };
            res.status(400).json(errorResponse);
            return;
        }
        // Verificar que la fecha de viaje es futura
        const fechaViaje = new Date(req.body.fechaViaje);
        if (fechaViaje <= new Date()) {
            const errorResponse = {
                error: 'La fecha de viaje debe ser futura'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const reserva = new Reserva_1.Reserva(req.body);
        await reserva.save();
        // Poblar datos para la respuesta
        const reservaPopulada = await Reserva_1.Reserva.findById(reserva._id)
            .populate('usuario', 'nombre email')
            .populate('paquete', 'nombre destino precio');
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
// Controller para actualizar una reserva
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
        // Validar datos de actualización
        const updateSchema = Reserva_1.reservaJoiSchema.fork(Object.keys(Reserva_1.reservaJoiSchema.describe().keys), (schema) => schema.optional());
        const { error } = updateSchema.validate(req.body);
        if (error) {
            const errorResponse = {
                error: 'Datos de validación incorrectos',
                details: error.details[0]?.message || 'Error de validación'
            };
            res.status(400).json(errorResponse);
            return;
        }
        // Verificar que la fecha de viaje es futura si se está actualizando
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
        const reserva = await Reserva_1.Reserva.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
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
// Controller para cancelar una reserva
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
        const reserva = await Reserva_1.Reserva.findByIdAndUpdate(id, { estado: 'cancelada' }, { new: true })
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
// Controller para confirmar una reserva
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
        const reserva = await Reserva_1.Reserva.findByIdAndUpdate(id, { estado: 'confirmada' }, { new: true })
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
            message: 'Reserva confirmada exitosamente',
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
// Controller para eliminar una reserva (baja lógica)
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
        const reserva = await Reserva_1.Reserva.findByIdAndDelete(id);
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
// Controller para obtener estadísticas de reservas
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
        const stats = await Reserva_1.Reserva.aggregate([
            { $match: filters },
            {
                $group: {
                    _id: '$estado',
                    count: { $sum: 1 },
                    totalIngresos: { $sum: '$precioTotal' }
                }
            }
        ]);
        const totalReservas = await Reserva_1.Reserva.countDocuments(filters);
        const totalIngresos = await Reserva_1.Reserva.aggregate([
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
// Exportar todos los controllers
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