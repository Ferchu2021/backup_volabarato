import { Router } from 'express';
import { getFirebaseProfile, checkFirebaseStatus } from '../controllers/firebase.controllers.js';
import { linkFirebaseUser, getFirebaseLinkedUser } from '../controllers/firebaseUser.controllers.js';
import { firebaseAuth } from '../middlewares/firebaseAuth.js';

const router = Router();

// GET /api/firebase/status - Verificar estado de Firebase (sin autenticación)
router.get('/status', checkFirebaseStatus);

// GET /api/firebase/profile - Obtener perfil del usuario autenticado con Firebase
router.get('/profile', firebaseAuth, getFirebaseProfile);

// GET /api/firebase/user - Obtener usuario de MongoDB vinculado con Firebase
router.get('/user', firebaseAuth, getFirebaseLinkedUser);

// POST /api/firebase/link-user - Vincular usuario de Firebase con usuario en MongoDB
router.post('/link-user', firebaseAuth, linkFirebaseUser);

export default router;

