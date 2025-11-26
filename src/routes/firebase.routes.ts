import { Router } from 'express';
import { getFirebaseProfile, checkFirebaseStatus } from '../controllers/firebase.controllers.js';
import { firebaseAuth } from '../middlewares/firebaseAuth.js';

const router = Router();

// GET /api/firebase/status - Verificar estado de Firebase (sin autenticación)
router.get('/status', checkFirebaseStatus);

// GET /api/firebase/profile - Obtener perfil del usuario autenticado con Firebase
router.get('/profile', firebaseAuth, getFirebaseProfile);

export default router;

