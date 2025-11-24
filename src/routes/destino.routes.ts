import { Router } from 'express';
import { 
  getAllDestinos, 
  getDestinoById, 
  createDestino, 
  updateDestino, 
  deleteDestino, 
  searchDestinos,
  getDestinosByPais,
  getDestinosByClima
} from '../controllers/destino.controllers.js';

const router = Router();

// GET /api/destino - Obtener todos los destinos (con filtros y paginación)
router.get('/', getAllDestinos);

// GET /api/destino/search - Buscar destinos
router.get('/search', searchDestinos);

// GET /api/destino/pais/:pais - Obtener destinos por país
router.get('/pais/:pais', getDestinosByPais);

// GET /api/destino/clima/:clima - Obtener destinos por clima
router.get('/clima/:clima', getDestinosByClima);

// GET /api/destino/:id - Obtener destino por ID
router.get('/:id', getDestinoById);

// POST /api/destino - Crear nuevo destino
router.post('/', createDestino);

// PUT /api/destino/:id - Actualizar destino
router.put('/:id', updateDestino);

// DELETE /api/destino/:id - Eliminar destino
router.delete('/:id', deleteDestino);

export default router;
