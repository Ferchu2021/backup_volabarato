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
exports.Producto = exports.productoJoiSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
// Schema de Mongoose
const productoSchema = new mongoose_1.Schema({
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true, trim: true },
    precio: { type: Number, required: true, min: 0 },
    categoria: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    imagen: { type: String, trim: true },
    activo: { type: Boolean, default: true },
    fechaCreacion: { type: Date, default: Date.now },
    fechaActualizacion: { type: Date, default: Date.now }
});
// Middleware pre-save para actualizar fechaActualizacion
productoSchema.pre('save', function (next) {
    this.fechaActualizacion = new Date();
    next();
});
// Schema de validación Joi
exports.productoJoiSchema = joi_1.default.object({
    nombre: joi_1.default.string().min(2).max(100).required(),
    descripcion: joi_1.default.string().min(10).max(500).required(),
    precio: joi_1.default.number().positive().required(),
    categoria: joi_1.default.string().min(2).max(50).required(),
    stock: joi_1.default.number().min(0).required(),
    imagen: joi_1.default.string().uri().optional(),
    activo: joi_1.default.boolean().optional()
});
// Modelo exportado
exports.Producto = mongoose_1.default.model('Producto', productoSchema);
//# sourceMappingURL=Producto.js.map