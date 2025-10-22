"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = require("../controllers/user.controllers");
const auth_1 = require("../middlewares/auth");
const user_middlewares_1 = require("../middlewares/user.middlewares");
const router = (0, express_1.Router)();
// POST /api/user/register
router.post('/register', user_middlewares_1.validateUsernameFormat, user_middlewares_1.validatePasswordFormat, user_middlewares_1.checkUserExists, user_controllers_1.registerUser);
// POST /api/user/login
router.post('/login', user_controllers_1.loginUser);
// GET /api/user/me - Obtener información del usuario actual
router.get('/me', auth_1.auth, user_controllers_1.getCurrentUser);
// PUT /api/user/me - Actualizar información del usuario actual
router.put('/me', auth_1.auth, user_controllers_1.updateUser);
// DELETE /api/user/me - Eliminar usuario actual
router.delete('/me', auth_1.auth, user_controllers_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map