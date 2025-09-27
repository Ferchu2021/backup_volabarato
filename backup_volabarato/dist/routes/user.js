"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
router.post('/register', async (req, res) => {
    try {
        const { error } = User_1.userJoiSchema.validate(req.body);
        if (error) {
            res.status(400).json({
                error: 'Datos de validación incorrectos',
                details: error.details[0]?.message || 'Error de validación'
            });
            return;
        }
        const user = new User_1.User(req.body);
        await user.save();
        res.status(201).json({
            message: 'Usuario creado exitosamente',
            user: {
                _id: user._id,
                usuario: user.usuario
            }
        });
    }
    catch (error) {
        console.error('Error en registro:', error);
        if (error.code === 11000) {
            res.status(400).json({ error: 'El usuario ya existe' });
            return;
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { usuario, password } = req.body;
        if (!usuario || !password) {
            res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
            return;
        }
        const user = await User_1.User.findOne({ usuario });
        if (!user) {
            res.status(401).json({ error: 'Credenciales inválidas' });
            return;
        }
        const validPassword = bcrypt_1.default.compareSync(password, user.password);
        if (!validPassword) {
            res.status(401).json({ error: 'Credenciales inválidas' });
            return;
        }
        if (!process.env.JWT_SECRET) {
            res.status(500).json({ error: 'Error de configuración del servidor' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ _id: user._id, usuario: user.usuario }, process.env.JWT_SECRET, { expiresIn: '24h' });
        const response = { token };
        res.json(response);
    }
    catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.default = router;
//# sourceMappingURL=user.js.map