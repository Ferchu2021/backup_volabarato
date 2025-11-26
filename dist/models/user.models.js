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
exports.User = exports.userJoiSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const joi_1 = __importDefault(require("joi"));
const userSchema = new mongoose_1.Schema({
    usuario: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: {
        type: String,
        enum: ['admin', 'cliente'],
        default: 'cliente',
        required: true
    },
    nombreLegal: { type: String, required: true, trim: true },
    fechaNacimiento: { type: Date, required: true },
    nacionalidad: { type: String, required: true, trim: true },
    dni: { type: String, required: true, trim: true },
    cuilCuit: { type: String, trim: true },
    numeroPasaporte: { type: String, required: true, trim: true },
    telefono: { type: String, required: true, trim: true },
    telefonoContacto: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    resetPasswordToken: { type: String, trim: true },
    resetPasswordExpires: { type: Date }
});
userSchema.index({ dni: 1 });
userSchema.index({ numeroPasaporte: 1 });
userSchema.pre('save', function (next) {
    if (!this.isModified('password'))
        return next();
    this.password = bcrypt_1.default.hashSync(this.password, 10);
    next();
});
exports.userJoiSchema = joi_1.default.object({
    usuario: joi_1.default.string().min(4).max(30).required(),
    password: joi_1.default.string().min(6).required(),
    rol: joi_1.default.string().valid('admin', 'cliente').optional(),
    nombreLegal: joi_1.default.string().min(2).max(100).required(),
    fechaNacimiento: joi_1.default.alternatives().try(joi_1.default.date().max('now'), joi_1.default.string().isoDate()).required().messages({
        'date.max': 'La fecha de nacimiento debe ser anterior a la fecha actual',
        'alternatives.match': 'La fecha de nacimiento debe ser una fecha válida'
    }),
    nacionalidad: joi_1.default.string().min(2).max(50).required(),
    dni: joi_1.default.string().min(7).max(10).required(),
    cuilCuit: joi_1.default.string().min(10).max(13).optional().allow('', null),
    numeroPasaporte: joi_1.default.string().min(5).max(20).required(),
    telefono: joi_1.default.string().min(8).max(20).required(),
    telefonoContacto: joi_1.default.string().min(8).max(20).required(),
    email: joi_1.default.string().email().required()
}).unknown(false);
exports.User = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=user.models.js.map