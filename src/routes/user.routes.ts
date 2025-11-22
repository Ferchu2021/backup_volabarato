import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser, updateUser, deleteUser, getAllUsers, getUserById, changePassword, requestPasswordReset, resetPassword } from '../controllers/user.controllers';
import { checkUserExists, validatePasswordFormat, validateUsernameFormat } from '../middlewares/user.middlewares';

const router = Router();

// POST /api/user/register
router.post('/register', 
  validateUsernameFormat,
  validatePasswordFormat,
  checkUserExists,
  registerUser
);

// POST /api/user/login
router.post('/login', loginUser);

// GET /api/user - Obtener todos los usuarios
router.get('/', getAllUsers);

// GET /api/user/me - Obtener información del usuario actual
router.get('/me', getCurrentUser);

// PUT /api/user/me - Actualizar información del usuario actual
router.put('/me', updateUser);

// PUT /api/user/change-password - Cambiar contraseña
router.put('/change-password', changePassword);

// POST /api/user/forgot-password - Solicitar recuperación de contraseña
router.post('/forgot-password', requestPasswordReset);

// POST /api/user/reset-password - Resetear contraseña con token
router.post('/reset-password', resetPassword);

// DELETE /api/user/me - Eliminar usuario actual
router.delete('/me', deleteUser);

// GET /api/user/:id - Obtener un usuario por ID
router.get('/:id', getUserById);

// PUT /api/user/:id - Actualizar un usuario por ID
router.put('/:id', updateUser);

// DELETE /api/user/:id - Eliminar un usuario por ID
router.delete('/:id', deleteUser);

export default router;
