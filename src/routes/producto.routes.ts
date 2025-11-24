import { Router } from 'express';
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

// POST /api/producto - Crear nuevo producto
router.post('/', createProducto);

// PUT /api/producto/:id - Actualizar producto
router.put('/:id', updateProducto);

// DELETE /api/producto/:id - Eliminar producto
router.delete('/:id', deleteProducto);

export default router;
