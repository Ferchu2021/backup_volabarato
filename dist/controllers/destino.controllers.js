"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDestinosByClima = exports.getDestinosByPais = exports.searchDestinos = exports.deleteDestino = exports.updateDestino = exports.createDestino = exports.getDestinoById = exports.getAllDestinos = void 0;
const Destino_1 = require("../models/Destino");
const getAllDestinos = async (req, res) => {
    try {
        const { pais, activo, limit = 10, page = 1 } = req.query;
        const filters = {};
        if (pais)
            filters.pais = pais;
        if (activo !== undefined)
            filters.activo = activo === 'true';
        const skip = (Number(page) - 1) * Number(limit);
        const destinos = await Destino_1.Destino.find(filters)
            .sort({ fechaCreacion: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await Destino_1.Destino.countDocuments(filters);
        res.json({
            destinos,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Error obteniendo destinos:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.getAllDestinos = getAllDestinos;
const getDestinoById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            const errorResponse = {
                error: 'ID del destino es requerido'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const destino = await Destino_1.Destino.findById(id);
        if (!destino) {
            const errorResponse = {
                error: 'Destino no encontrado'
            };
            res.status(404).json(errorResponse);
            return;
        }
        res.json(destino);
    }
    catch (error) {
        console.error('Error obteniendo destino:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.getDestinoById = getDestinoById;
const createDestino = async (req, res) => {
    try {
        const { error } = Destino_1.destinoJoiSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorDetails = error.details.map(detail => ({
                campo: detail.path.join('.'),
                mensaje: detail.message,
                valor: detail.context?.value
            }));
            const errorResponse = {
                error: 'Datos de validación incorrectos',
                message: 'Uno o más campos requeridos no cumplen con los requisitos',
                details: JSON.stringify(errorDetails)
            };
            res.status(400).json({
                ...errorResponse,
                detalles: errorDetails,
                cantidad_errores: errorDetails.length,
                campos_requeridos: ['nombre', 'pais', 'ciudad', 'descripcion', 'clima', 'mejorEpoca', 'actividades', 'coordenadas']
            });
            return;
        }
        const destino = new Destino_1.Destino(req.body);
        await destino.save();
        res.status(201).json({
            message: 'Destino creado exitosamente',
            destino
        });
    }
    catch (error) {
        console.error('Error creando destino:', error);
        if (error.code === 11000) {
            const errorResponse = {
                error: 'El destino ya existe',
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
exports.createDestino = createDestino;
const updateDestino = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            const errorResponse = {
                error: 'ID del destino es requerido',
                message: 'Proporciona un ID válido en la URL'
            };
            res.status(400).json(errorResponse);
            return;
        }
        if (Object.keys(req.body).length === 0) {
            const errorResponse = {
                error: 'No se proporcionaron campos para actualizar',
                message: 'Debes enviar al menos un campo a actualizar',
                details: 'Campos disponibles: nombre, pais, ciudad, descripcion, clima, mejorEpoca, actividades, imagen, coordenadas, activo'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const { error } = Destino_1.destinoUpdateJoiSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorDetails = error.details.map(detail => ({
                campo: detail.path.join('.'),
                mensaje: detail.message,
                valor: detail.context?.value
            }));
            const errorResponse = {
                error: 'Datos de validación incorrectos',
                message: `Se encontraron ${errorDetails.length} error(es) de validación`,
                details: JSON.stringify(errorDetails)
            };
            res.status(400).json({
                ...errorResponse,
                errores: errorDetails,
                cantidad_errores: errorDetails.length
            });
            return;
        }
        const destino = await Destino_1.Destino.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!destino) {
            const errorResponse = {
                error: 'Destino no encontrado',
                message: `No se encontró un destino con el ID: ${id}`
            };
            res.status(404).json(errorResponse);
            return;
        }
        res.json({
            message: 'Destino actualizado exitosamente',
            destino
        });
    }
    catch (error) {
        console.error('Error actualizando destino:', error);
        const errorResponse = {
            error: 'Error interno del servidor',
            message: 'Ocurrió un error al procesar la solicitud'
        };
        res.status(500).json(errorResponse);
    }
};
exports.updateDestino = updateDestino;
const deleteDestino = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            const errorResponse = {
                error: 'ID del destino es requerido'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const destino = await Destino_1.Destino.findByIdAndUpdate(id, { activo: false }, { new: true });
        if (!destino) {
            const errorResponse = {
                error: 'Destino no encontrado'
            };
            res.status(404).json(errorResponse);
            return;
        }
        res.json({
            message: 'Destino eliminado exitosamente (baja lógica)',
            destino
        });
    }
    catch (error) {
        console.error('Error eliminando destino:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.deleteDestino = deleteDestino;
const searchDestinos = async (req, res) => {
    try {
        const { q, pais, clima } = req.query;
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
                { pais: { $regex: q, $options: 'i' } },
                { ciudad: { $regex: q, $options: 'i' } },
                { descripcion: { $regex: q, $options: 'i' } },
                { actividades: { $in: [new RegExp(q, 'i')] } }
            ],
            activo: true
        };
        if (pais)
            filters.pais = pais;
        if (clima)
            filters.clima = clima;
        const destinos = await Destino_1.Destino.find(filters).sort({ fechaCreacion: -1 });
        res.json({
            destinos,
            total: destinos.length,
            query: q
        });
    }
    catch (error) {
        console.error('Error buscando destinos:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.searchDestinos = searchDestinos;
const getDestinosByPais = async (req, res) => {
    try {
        const { pais } = req.params;
        if (!pais) {
            const errorResponse = {
                error: 'País es requerido'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const destinos = await Destino_1.Destino.find({
            pais: { $regex: pais, $options: 'i' },
            activo: true
        }).sort({ ciudad: 1 });
        res.json({
            destinos,
            total: destinos.length,
            pais
        });
    }
    catch (error) {
        console.error('Error obteniendo destinos por país:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.getDestinosByPais = getDestinosByPais;
const getDestinosByClima = async (req, res) => {
    try {
        const { clima } = req.params;
        if (!clima) {
            const errorResponse = {
                error: 'Clima es requerido'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const destinos = await Destino_1.Destino.find({
            clima: { $regex: clima, $options: 'i' },
            activo: true
        }).sort({ nombre: 1 });
        res.json({
            destinos,
            total: destinos.length,
            clima
        });
    }
    catch (error) {
        console.error('Error obteniendo destinos por clima:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.getDestinosByClima = getDestinosByClima;
exports.default = {
    getAllDestinos: exports.getAllDestinos,
    getDestinoById: exports.getDestinoById,
    createDestino: exports.createDestino,
    updateDestino: exports.updateDestino,
    deleteDestino: exports.deleteDestino,
    searchDestinos: exports.searchDestinos,
    getDestinosByPais: exports.getDestinosByPais,
    getDestinosByClima: exports.getDestinosByClima
};
//# sourceMappingURL=destino.controllers.js.map