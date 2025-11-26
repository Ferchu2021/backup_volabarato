"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.requestPasswordReset = exports.getUserById = exports.getAllUsers = exports.deleteUser = exports.changePassword = exports.updateUser = exports.getCurrentUser = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
const user_models_js_1 = require("../models/user.models.js");
const email_service_js_1 = require("../services/email.service.js");
const registerUser = async (req, res) => {
    try {
        console.log('=== REGISTER USER DEBUG ===');
        console.log('Ruta:', req.method, req.path);
        console.log('URL completa:', req.url);
        console.log('Headers Authorization:', req.header('Authorization') ? 'Presente' : 'Ausente');
        console.log('Body recibido en registerUser:', JSON.stringify(req.body, null, 2));
        console.log('Tipo de req.body:', typeof req.body);
        console.log('Keys de req.body:', Object.keys(req.body || {}));
        const schemaDescription = user_models_js_1.userJoiSchema.describe();
        const schemaKeys = schemaDescription.keys ? Object.keys(schemaDescription.keys) : [];
        console.log('Schema keys esperados:', schemaKeys);
        console.log('Schema completo:', JSON.stringify(schemaDescription, null, 2));
        const { error, value } = user_models_js_1.userJoiSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: false,
            allowUnknown: false
        });
        if (error) {
            console.error('=== ERROR DE VALIDACIÓN ===');
            console.error('Error completo:', JSON.stringify(error, null, 2));
            console.error('Detalles del error:', error.details);
            console.error('Value después de validación:', value);
            console.error('Error details map:', error.details.map(d => ({
                path: d.path,
                message: d.message,
                type: d.type,
                context: d.context
            })));
            const errorResponse = {
                error: 'Datos de validación incorrectos',
                details: error.details.map(d => `${d.path.join('.')}: ${d.message}`).join('; ') || 'Error de validación'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const userData = {
            ...req.body,
            fechaNacimiento: req.body.fechaNacimiento instanceof Date
                ? req.body.fechaNacimiento
                : new Date(req.body.fechaNacimiento)
        };
        const user = new user_models_js_1.User(userData);
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
            const keyPattern = error.keyPattern || {};
            let duplicateField = 'usuario';
            let errorMessage = 'El usuario ya existe';
            let suggestion = 'Intenta con un nombre de usuario diferente';
            if (keyPattern.email) {
                duplicateField = 'email';
                errorMessage = 'El email ya está registrado';
                suggestion = 'Intenta con un email diferente o inicia sesión si ya tienes una cuenta';
            }
            else if (keyPattern.dni) {
                duplicateField = 'dni';
                errorMessage = 'El DNI ya está registrado';
                suggestion = 'Este DNI ya está asociado a otra cuenta';
            }
            else if (keyPattern.numeroPasaporte) {
                duplicateField = 'numeroPasaporte';
                errorMessage = 'El número de pasaporte ya está registrado';
                suggestion = 'Este número de pasaporte ya está asociado a otra cuenta';
            }
            else if (keyPattern.usuario) {
                duplicateField = 'usuario';
                errorMessage = 'El usuario ya existe';
                suggestion = 'Intenta con un nombre de usuario diferente o inicia sesión si ya tienes una cuenta';
            }
            const errorResponse = {
                error: errorMessage,
                message: suggestion
            };
            res.status(409).json(errorResponse);
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
        const usuario = req.body.usuario?.trim();
        const password = req.body.password?.trim();
        if (!usuario || !password) {
            const errorResponse = {
                error: 'Usuario y contraseña son requeridos'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const user = await user_models_js_1.User.findOne({ usuario });
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
        const token = jsonwebtoken_1.default.sign({ _id: user._id, usuario: user.usuario, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '24h' });
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
        const { id } = req.query;
        if (!id) {
            const errorResponse = {
                error: 'ID de usuario requerido'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const user = await user_models_js_1.User.findById(id).select('-password');
        if (!user) {
            const errorResponse = {
                error: 'Usuario no encontrado'
            };
            res.status(404).json(errorResponse);
            return;
        }
        res.json({
            _id: user._id,
            usuario: user.usuario,
            rol: user.rol
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
        const id = req.params.id || req.body.id;
        if (!id) {
            const errorResponse = {
                error: 'ID de usuario requerido'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const { usuario, password, rol } = req.body;
        if (usuario) {
            const existingUser = await user_models_js_1.User.findOne({
                usuario,
                _id: { $ne: id }
            });
            if (existingUser) {
                const errorResponse = {
                    error: 'El nombre de usuario ya está en uso'
                };
                res.status(400).json(errorResponse);
                return;
            }
        }
        const updateData = {};
        if (usuario)
            updateData.usuario = usuario;
        if (password)
            updateData.password = password;
        if (rol)
            updateData.rol = rol;
        const user = await user_models_js_1.User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');
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
                usuario: user.usuario,
                rol: user.rol,
                nombreLegal: user.nombreLegal,
                email: user.email
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
const changePassword = async (req, res) => {
    try {
        const { id, currentPassword, newPassword } = req.body;
        if (!id) {
            const errorResponse = {
                error: 'ID de usuario requerido'
            };
            res.status(400).json(errorResponse);
            return;
        }
        if (!currentPassword || !newPassword) {
            const errorResponse = {
                error: 'La contraseña actual y la nueva contraseña son requeridas'
            };
            res.status(400).json(errorResponse);
            return;
        }
        if (newPassword.length < 6) {
            const errorResponse = {
                error: 'La nueva contraseña debe tener al menos 6 caracteres'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const user = await user_models_js_1.User.findById(id);
        if (!user) {
            const errorResponse = {
                error: 'Usuario no encontrado'
            };
            res.status(404).json(errorResponse);
            return;
        }
        const validPassword = bcrypt_1.default.compareSync(currentPassword, user.password);
        if (!validPassword) {
            const errorResponse = {
                error: 'La contraseña actual es incorrecta'
            };
            res.status(401).json(errorResponse);
            return;
        }
        user.password = newPassword;
        await user.save();
        res.json({
            message: 'Contraseña actualizada exitosamente'
        });
    }
    catch (error) {
        console.error('Error cambiando contraseña:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.changePassword = changePassword;
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id || req.body.id;
        if (!id) {
            const errorResponse = {
                error: 'ID de usuario requerido'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const user = await user_models_js_1.User.findById(id);
        if (!user) {
            const errorResponse = {
                error: 'Usuario no encontrado'
            };
            res.status(404).json(errorResponse);
            return;
        }
        await user_models_js_1.User.findByIdAndDelete(id);
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
const getAllUsers = async (req, res) => {
    try {
        const users = await user_models_js_1.User.find({}).select('-password');
        res.json(users);
    }
    catch (error) {
        console.error('Error obteniendo usuarios:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            const errorResponse = {
                error: 'ID de usuario inválido'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const user = await user_models_js_1.User.findById(id).select('-password');
        if (!user) {
            const errorResponse = {
                error: 'Usuario no encontrado'
            };
            res.status(404).json(errorResponse);
            return;
        }
        res.json(user);
    }
    catch (error) {
        console.error('Error obteniendo usuario:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.getUserById = getUserById;
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            const errorResponse = {
                error: 'El email es requerido'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const user = await user_models_js_1.User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            res.json({
                message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña'
            });
            return;
        }
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const resetTokenHash = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);
        await user.save();
        try {
            await (0, email_service_js_1.enviarEmailRecuperacionPassword)(user.email, user.nombreLegal || user.usuario, resetToken);
        }
        catch (emailError) {
            console.error('Error enviando email:', emailError);
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();
            const errorResponse = {
                error: 'Error al enviar el email. Por favor intenta más tarde.'
            };
            res.status(500).json(errorResponse);
            return;
        }
        res.json({
            message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña'
        });
    }
    catch (error) {
        console.error('Error solicitando reset de contraseña:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            const errorResponse = {
                error: 'El token y la nueva contraseña son requeridos'
            };
            res.status(400).json(errorResponse);
            return;
        }
        if (newPassword.length < 6) {
            const errorResponse = {
                error: 'La contraseña debe tener al menos 6 caracteres'
            };
            res.status(400).json(errorResponse);
            return;
        }
        const resetTokenHash = crypto_1.default.createHash('sha256').update(token).digest('hex');
        const user = await user_models_js_1.User.findOne({
            resetPasswordToken: resetTokenHash,
            resetPasswordExpires: { $gt: new Date() }
        });
        if (!user) {
            const errorResponse = {
                error: 'El token es inválido o ha expirado'
            };
            res.status(400).json(errorResponse);
            return;
        }
        user.password = newPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();
        res.json({
            message: 'Contraseña restablecida exitosamente'
        });
    }
    catch (error) {
        console.error('Error reseteando contraseña:', error);
        const errorResponse = {
            error: 'Error interno del servidor'
        };
        res.status(500).json(errorResponse);
    }
};
exports.resetPassword = resetPassword;
exports.default = {
    registerUser: exports.registerUser,
    loginUser: exports.loginUser,
    getCurrentUser: exports.getCurrentUser,
    updateUser: exports.updateUser,
    deleteUser: exports.deleteUser,
    getAllUsers: exports.getAllUsers,
    getUserById: exports.getUserById,
    requestPasswordReset: exports.requestPasswordReset,
    resetPassword: exports.resetPassword
};
//# sourceMappingURL=user.controllers.js.map