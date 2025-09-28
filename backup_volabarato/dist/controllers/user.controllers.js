"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getCurrentUser = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_models_1 = require("../models/user.models");
const registerUser = async (req, res) => {
    try {
        const { error } = user_models_1.userJoiSchema.validate(req.body);
        if (error) {
            const errorResponse = {
                error: 'Datos de validación incorrectos',
                details: error.details[0]?.message || 'Error de validación'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const user = new user_models_1.User(req.body);
        await user.save();
        const response = {
            message: 'Usuario creado exitosamente',
            user: {
                _id: user._id.toString(),
                usuario: user.usuario
            }
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error('Error en registro:', error);
        if (error.code === 11000) {
            const errorResponse = {
                error: 'El usuario ya existe',
                message: 'Intenta con un nombre de usuario diferente'
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
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { usuario, password } = req.body;
        if (!usuario || !password) {
            const errorResponse = {
                error: 'Usuario y contraseña son requeridos'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const user = await user_models_1.User.findOne({ usuario });
        if (!user) {
            const errorResponse = {
                error: 'Credenciales inválidas',
                message: 'Verifica que el nombre de usuario sea correcto'
            };
            res.status(401).json(errorResponse);
            return;
        }
        const validPassword = bcrypt_1.default.compareSync(password, user.password);
        if (!validPassword) {
            const errorResponse = {
                error: 'Credenciales inválidas',
                message: 'Verifica que la contraseña sea correcta'
            };
            res.status(401).json(errorResponse);
            return;
        }
        if (!process.env.JWT_SECRET) {
            const errorResponse = {
                error: 'Error de configuración del servidor'
            };
            res.status(500).json(errorResponse);
            return;
        }
        const token = jsonwebtoken_1.default.sign({ _id: user._id, usuario: user.usuario }, process.env.JWT_SECRET, { expiresIn: '24h' });
        const response = { token };
        res.json(response);
    }
    catch (error) {
        console.error('Error en login:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.loginUser = loginUser;
const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            const errorResponse = {
                error: 'Usuario no autenticado'
            };
            res.status(401).json(errorResponse);
            return;
        }
        const user = await user_models_1.User.findById(req.user._id).select('-password');
        if (!user) {
            const errorResponse = {
                error: 'Usuario no encontrado'
            };
            res.status(404).json(errorResponse);
            return;
        }
        res.json({
            _id: user._id,
            usuario: user.usuario
        });
    }
    catch (error) {
        console.error('Error obteniendo usuario:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.getCurrentUser = getCurrentUser;
const updateUser = async (req, res) => {
    try {
        if (!req.user) {
            const errorResponse = {
                error: 'Usuario no autenticado'
            };
            res.status(401).json(errorResponse);
            return;
        }
        const { usuario } = req.body;
        if (usuario) {
            const existingUser = await user_models_1.User.findOne({
                usuario,
                _id: { $ne: req.user._id }
            });
            if (existingUser) {
                const errorResponse = {
                    error: 'El nombre de usuario ya está en uso'
                };
                res.status(400).json(errorResponse);
                return;
            }
        }
        const user = await user_models_1.User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true }).select('-password');
        if (!user) {
            const errorResponse = {
                error: 'Usuario no encontrado'
            };
            res.status(404).json(errorResponse);
            return;
        }
        res.json({
            message: 'Usuario actualizado exitosamente',
            user: {
                _id: user._id,
                usuario: user.usuario
            }
        });
    }
    catch (error) {
        console.error('Error actualizando usuario:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        if (!req.user) {
            const errorResponse = {
                error: 'Usuario no autenticado'
            };
            res.status(401).json(errorResponse);
            return;
        }
        await user_models_1.User.findByIdAndDelete(req.user._id);
        res.json({
            message: 'Usuario eliminado exitosamente'
        });
    }
    catch (error) {
        console.error('Error eliminando usuario:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.deleteUser = deleteUser;
exports.default = {
    registerUser: exports.registerUser,
    loginUser: exports.loginUser,
    getCurrentUser: exports.getCurrentUser,
    updateUser: exports.updateUser,
    deleteUser: exports.deleteUser
};
//# sourceMappingURL=user.controllers.js.map