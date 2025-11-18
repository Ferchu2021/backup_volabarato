"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservaJoiSchema = exports.Reserva = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const reservaSchema = new mongoose_1.Schema({
    numeroReserva: {
        type: String,
        required: false,
        unique: true,
        index: true
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paquete: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Paquete',
        required: true
    },
    fechaReserva: {
        type: Date,
        required: true,
        default: Date.now
    },
    fechaViaje: {
        type: Date,
        required: true
    },
    cantidadPersonas: {
        type: Number,
        required: true,
        min: 1,
        max: 20
    },
    precioTotal: {
        type: Number,
        required: true,
        min: 0
    },
    estado: {
        type: String,
        enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
        default: 'pendiente'
    },
    metodoPago: {
        type: String,
        enum: ['efectivo', 'tarjeta', 'transferencia'],
        required: true
    },
    observaciones: {
        type: String,
        trim: true,
        maxlength: 500
    },
    datosContacto: {
        nombre: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        telefono: { type: String, required: true, trim: true }
    },
    fechaCreacion: { type: Date, default: Date.now },
    fechaActualizacion: { type: Date, default: Date.now }
});
reservaSchema.pre('save', async function (next) {
    this.fechaActualizacion = new Date();
    if (this.isNew && !this.numeroReserva) {
        const fecha = new Date();
        const fechaStr = fecha.toISOString().slice(0, 10).replace(/-/g, '');
        const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        const timestamp = Date.now().toString().slice(-6);
        this.numeroReserva = `RES-${fechaStr}-${timestamp}-${randomNum}`;
    }
    next();
});
exports.Reserva = mongoose_1.default.model('Reserva', reservaSchema);
reservaSchema.index({ numeroReserva: 1 });
reservaSchema.index({ usuario: 1 });
reservaSchema.index({ paquete: 1 });
reservaSchema.index({ estado: 1 });
reservaSchema.index({ fechaViaje: 1 });
reservaSchema.index({ fechaReserva: -1 });
exports.reservaJoiSchema = joi_1.default.object({
    paquete: joi_1.default.string().hex().length(24).required(),
    fechaViaje: joi_1.default.date().greater('now').required().messages({
        'date.greater': 'La fecha de viaje debe ser futura',
        'date.base': 'La fecha de viaje debe ser una fecha válida'
    }),
    cantidadPersonas: joi_1.default.number().integer().min(1).max(20).required(),
    precioTotal: joi_1.default.number().positive().required(),
    estado: joi_1.default.string().valid('pendiente', 'confirmada', 'cancelada', 'completada').optional(),
    metodoPago: joi_1.default.string().valid('efectivo', 'tarjeta', 'transferencia').required(),
    observaciones: joi_1.default.string().max(500).allow('', null).optional(),
    datosContacto: joi_1.default.object({
        nombre: joi_1.default.string().min(2).max(100).required(),
        email: joi_1.default.string().email().required(),
        telefono: joi_1.default.string().min(8).max(20).required()
    }).required()
});
//# sourceMappingURL=Reserva.js.map