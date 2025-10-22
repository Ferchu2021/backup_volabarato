"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware de autenticación
const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Token requerido.' });
    }
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET no está configurado');
        }
        const verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    }
    catch (error) {
        console.error('Error en autenticación:', error);
        res.status(401).json({ error: 'Token inválido.' });
    }
};
exports.auth = auth;
exports.default = exports.auth;
//# sourceMappingURL=auth.js.map