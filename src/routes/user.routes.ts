import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser, updateUser, deleteUser, getAllUsers, getUserById, changePassword, requestPasswordReset, resetPassword } from '../controllers/user.controllers.js';
import { checkUserExists, validatePasswordFormat, validateUsernameFormat } from '../middlewares/user.middlewares.js';
import { dualAuth } from '../middlewares/dualAuth.js';
import { adminAuth } from '../middlewares/adminAuth.js';

const router = Router();

// Rutas públicas
// POST /api/user/register
router.post('/register', 
  validateUsernameFormat,
  validatePasswordFormat,
  checkUserExists,
  registerUser
);

// POST /api/user/login
router.post('/login', loginUser);

// POST /api/user/forgot-password - Solicitar recuperación de contraseña
router.post('/forgot-password', requestPasswordReset);

// POST /api/user/reset-password - Resetear contraseña con token
router.post('/reset-password', resetPassword);

// Rutas protegidas (requieren autenticación JWT o Firebase)
// GET /api/user/me - Obtener información del usuario actual
router.get('/me', dualAuth, getCurrentUser);

// PUT /api/user/me - Actualizar información del usuario actual
router.put('/me', dualAuth, updateUser);

// PUT /api/user/change-password - Cambiar contraseña
router.put('/change-password', dualAuth, changePassword);

// DELETE /api/user/me - Eliminar usuario actual
router.delete('/me', dualAuth, deleteUser);

// Rutas de administración (requieren rol admin)
// GET /api/user - Obtener todos los usuarios
router.get('/', adminAuth, getAllUsers);

// GET /api/user/:id - Obtener un usuario por ID
router.get('/:id', adminAuth, getUserById);

// PUT /api/user/:id - Actualizar un usuario por ID
router.put('/:id', adminAuth, updateUser);

// DELETE /api/user/:id - Eliminar un usuario por ID
router.delete('/:id', adminAuth, deleteUser);

export default router;
