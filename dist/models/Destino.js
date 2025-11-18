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
exports.Destino = exports.destinoUpdateJoiSchema = exports.destinoJoiSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const destinoSchema = new mongoose_1.Schema({
    nombre: { type: String, required: true, trim: true },
    pais: { type: String, required: true, trim: true },
    ciudad: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true, trim: true },
    clima: { type: String, required: true, trim: true },
    mejorEpoca: { type: String, required: true, trim: true },
    actividades: [{ type: String, trim: true }],
    imagen: { type: String, trim: true },
    coordenadas: {
        latitud: { type: Number, required: true, min: -90, max: 90 },
        longitud: { type: Number, required: true, min: -180, max: 180 }
    },
    activo: { type: Boolean, default: true },
    fechaCreacion: { type: Date, default: Date.now },
    fechaActualizacion: { type: Date, default: Date.now }
});
destinoSchema.pre('save', function (next) {
    this.fechaActualizacion = new Date();
    next();
});
exports.destinoJoiSchema = joi_1.default.object({
    nombre: joi_1.default.string().min(2).max(100).required(),
    pais: joi_1.default.string().min(2).max(50).required(),
    ciudad: joi_1.default.string().min(2).max(50).required(),
    descripcion: joi_1.default.string().min(10).max(1000).required(),
    clima: joi_1.default.string().min(2).max(100).required(),
    mejorEpoca: joi_1.default.string().min(2).max(100).required(),
    actividades: joi_1.default.array().items(joi_1.default.string().trim()).min(1).required(),
    imagen: joi_1.default.string().uri().optional(),
    coordenadas: joi_1.default.object({
        latitud: joi_1.default.number().min(-90).max(90).required(),
        longitud: joi_1.default.number().min(-180).max(180).required()
    }).required(),
    activo: joi_1.default.boolean().optional()
});
exports.destinoUpdateJoiSchema = joi_1.default.object({
    nombre: joi_1.default.string().min(2).max(100).optional(),
    pais: joi_1.default.string().min(2).max(50).optional(),
    ciudad: joi_1.default.string().min(2).max(50).optional(),
    descripcion: joi_1.default.string().min(10).max(1000).optional(),
    clima: joi_1.default.string().min(2).max(100).optional(),
    mejorEpoca: joi_1.default.string().min(2).max(100).optional(),
    actividades: joi_1.default.array().items(joi_1.default.string().trim()).min(1).optional(),
    imagen: joi_1.default.string().uri().allow(null, '').optional(),
    coordenadas: joi_1.default.object({
        latitud: joi_1.default.number().min(-90).max(90).required(),
        longitud: joi_1.default.number().min(-180).max(180).required()
    }).optional(),
    activo: joi_1.default.boolean().optional()
}).min(1).unknown(false);
exports.Destino = mongoose_1.default.model('Destino', destinoSchema);
//# sourceMappingURL=Destino.js.map