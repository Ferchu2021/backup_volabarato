import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser, updateUser, deleteUser } from '../controllers/user.controllers';
import { auth } from '../middlewares/auth';
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

// GET /api/user/me - Obtener información del usuario actual
router.get('/me', auth, getCurrentUser);

// PUT /api/user/me - Actualizar información del usuario actual
router.put('/me', auth, updateUser);

// DELETE /api/user/me - Eliminar usuario actual
router.delete('/me', auth, deleteUser);

export default router;
