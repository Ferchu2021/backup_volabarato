"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicRateLimit = exports.checkUserActive = exports.validateUsernameFormat = exports.validatePasswordFormat = exports.checkUserNotExists = exports.checkUserExists = void 0;
const user_models_js_1 = require("../models/user.models.js");
const checkUserExists = async (req, res, next) => {
    try {
        const { usuario } = req.body;
        if (!usuario) {
            return res.status(400).json({ error: 'Usuario es requerido' });
        }
        const existingUser = await user_models_js_1.User.findOne({ usuario });
        if (existingUser) {
            return res.status(409).json({
                error: 'El usuario ya existe',
                message: 'Intenta con un nombre de usuario diferente'
            });
        }
        next();
    }
    catch (error) {
        console.error('Error verificando existencia de usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
exports.checkUserExists = checkUserExists;
const checkUserNotExists = async (req, res, next) => {
    try {
        const { usuario } = req.body;
        if (!usuario) {
            return res.status(400).json({ error: 'Usuario es requerido' });
        }
        const existingUser = await user_models_js_1.User.findOne({ usuario });
        if (!existingUser) {
            return res.status(404).json({
                error: 'Usuario no encontrado',
                message: 'Verifica que el nombre de usuario sea correcto'
            });
        }
        req.user = {
            _id: existingUser._id.toString(),
            usuario: existingUser.usuario
        };
        next();
    }
    catch (error) {
        console.error('Error verificando usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
exports.checkUserNotExists = checkUserNotExists;
const validatePasswordFormat = (req, res, next) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({
            error: 'Contraseña es requerida'
        });
    }
    if (password.length < 6) {
        return res.status(400).json({
            error: 'La contraseña debe tener al menos 6 caracteres'
        });
    }
    if (password.length > 128) {
        return res.status(400).json({
            error: 'La contraseña no puede exceder 128 caracteres'
        });
    }
    if (password.includes(' ')) {
        return res.status(400).json({
            error: 'La contraseña no puede contener espacios'
        });
    }
    next();
};
exports.validatePasswordFormat = validatePasswordFormat;
const validateUsernameFormat = (req, res, next) => {
    const { usuario } = req.body;
    if (!usuario) {
        return res.status(400).json({
            error: 'Nombre de usuario es requerido'
        });
    }
    if (usuario.length < 4) {
        return res.status(400).json({
            error: 'El nombre de usuario debe tener al menos 4 caracteres'
        });
    }
    if (usuario.length > 30) {
        return res.status(400).json({
            error: 'El nombre de usuario no puede exceder 30 caracteres'
        });
    }
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(usuario)) {
        return res.status(400).json({
            error: 'El nombre de usuario solo puede contener letras, números y guiones bajos'
        });
    }
    next();
};
exports.validateUsernameFormat = validateUsernameFormat;
const checkUserActive = async (req, res, next) => {
    try {
        const { usuario } = req.body;
        if (!usuario) {
            return res.status(400).json({ error: 'Usuario es requerido' });
        }
        const user = await user_models_js_1.User.findOne({ usuario });
        if (!user) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }
        next();
    }
    catch (error) {
        console.error('Error verificando estado del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
exports.checkUserActive = checkUserActive;
exports.basicRateLimit = (() => {
    const attempts = {};
    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress || 'unknown';
        const now = Date.now();
        const windowMs = 15 * 60 * 1000;
        const maxAttempts = 5;
        if (attempts[ip] && now > attempts[ip].resetTime) {
            delete attempts[ip];
        }
        if (!attempts[ip]) {
            attempts[ip] = { count: 1, resetTime: now + windowMs };
        }
        else {
            attempts[ip].count++;
        }
        if (attempts[ip].count > maxAttempts) {
            return res.status(429).json({
                error: 'Demasiados intentos de acceso',
                message: `Intenta nuevamente en ${Math.ceil((attempts[ip].resetTime - now) / 60000)} minutos`
            });
        }
        next();
    };
})();
exports.default = {
    checkUserExists: exports.checkUserExists,
    checkUserNotExists: exports.checkUserNotExists,
    validatePasswordFormat: exports.validatePasswordFormat,
    validateUsernameFormat: exports.validateUsernameFormat,
    checkUserActive: exports.checkUserActive,
    basicRateLimit: exports.basicRateLimit
};
//# sourceMappingURL=user.middlewares.js.map