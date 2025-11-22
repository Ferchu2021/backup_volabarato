import { Router } from 'express';
import { 
  getAllSuscriptores, 
  getSuscriptorById, 
  createSuscriptor, 
  updateSuscriptor,
  desuscribirSuscriptor,
  deleteSuscriptor,
  getSuscriptoresStats
} from '../controllers/suscriptor.controllers';

const router = Router();

// GET /api/suscriptor - Obtener todos los suscriptores (con filtros y paginación)
router.get('/', getAllSuscriptores);

// GET /api/suscriptor/stats - Obtener estadísticas de suscriptores
router.get('/stats', getSuscriptoresStats);

// GET /api/suscriptor/:id - Obtener suscriptor por ID
router.get('/:id', getSuscriptorById);

// POST /api/suscriptor - Crear nuevo suscriptor
router.post('/', createSuscriptor);

// PUT /api/suscriptor/:id - Actualizar suscriptor
router.put('/:id', updateSuscriptor);

// PUT /api/suscriptor/:id/desuscribir - Desuscribir suscriptor
router.put('/:id/desuscribir', desuscribirSuscriptor);

// DELETE /api/suscriptor/:id - Eliminar suscriptor
router.delete('/:id', deleteSuscriptor);

export default router;

