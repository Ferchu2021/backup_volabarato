import { Router } from 'express';
import { adminAuth } from '../middlewares/adminAuth.js';
import { 
  getAllProductos, 
  getProductoById, 
  createProducto, 
  updateProducto, 
  deleteProducto, 
  searchProductos 
} from '../controllers/producto.controllers.js';

const router = Router();

// GET /api/producto - Obtener todos los productos (con filtros y paginación)
router.get('/', getAllProductos);

// GET /api/producto/search - Buscar productos
router.get('/search', searchProductos);

// GET /api/producto/:id - Obtener producto por ID
router.get('/:id', getProductoById);

// POST /api/producto - Crear nuevo producto (requiere admin)
router.post('/', adminAuth, createProducto);

// PUT /api/producto/:id - Actualizar producto (requiere admin)
router.put('/:id', adminAuth, updateProducto);

// DELETE /api/producto/:id - Eliminar producto (requiere admin)
router.delete('/:id', adminAuth, deleteProducto);

export default router;
