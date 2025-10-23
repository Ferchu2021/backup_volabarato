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
exports.Paquete = exports.paqueteJoiSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
// Schema de Mongoose
const paqueteSchema = new mongoose_1.Schema({
    nombre: { type: String, required: true },
    destino: { type: String, required: true },
    fecha: { type: Date, required: true },
    precio: { type: Number, required: true, min: 0 },
    descripcion: { type: String },
    activo: { type: Boolean, default: true }
});
// Schema de validación Joi
exports.paqueteJoiSchema = joi_1.default.object({
    nombre: joi_1.default.string().required(),
    destino: joi_1.default.string().required(),
    fecha: joi_1.default.date().required(),
    precio: joi_1.default.number().positive().required(),
    descripcion: joi_1.default.string().optional(),
    activo: joi_1.default.boolean()
});
// Modelo exportado
exports.Paquete = mongoose_1.default.model('Paquete', paqueteSchema);
//# sourceMappingURL=Paquete.js.map