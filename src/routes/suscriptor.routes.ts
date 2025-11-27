import { Router } from 'express';
import { 
  getAllSuscriptores, 
  getSuscriptorById, 
  createSuscriptor, 
  updateSuscriptor,
  desuscribirSuscriptor,
  deleteSuscriptor,
  getSuscriptoresStats
} from '../controllers/suscriptor.controllers.js';
import { dualAuth } from '../middlewares/dualAuth.js';
import { adminAuth } from '../middlewares/adminAuth.js';

const router = Router();

// Rutas públicas
// POST /api/suscriptor - Crear nuevo suscriptor (público, para suscripciones)
router.post('/', createSuscriptor);

// Rutas protegidas (requieren autenticación)
// GET /api/suscriptor - Obtener todos los suscriptores (requiere admin)
router.get('/', adminAuth, getAllSuscriptores);

// GET /api/suscriptor/stats - Obtener estadísticas de suscriptores (requiere admin)
router.get('/stats', adminAuth, getSuscriptoresStats);

// GET /api/suscriptor/:id - Obtener suscriptor por ID (requiere admin)
router.get('/:id', adminAuth, getSuscriptorById);

// PUT /api/suscriptor/:id - Actualizar suscriptor (requiere admin)
router.put('/:id', adminAuth, updateSuscriptor);

// PUT /api/suscriptor/:id/desuscribir - Desuscribir suscriptor (requiere admin)
router.put('/:id/desuscribir', adminAuth, desuscribirSuscriptor);

// DELETE /api/suscriptor/:id - Eliminar suscriptor (requiere admin)
router.delete('/:id', adminAuth, deleteSuscriptor);

export default router;

