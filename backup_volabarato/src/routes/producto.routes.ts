import { Router } from 'express';
import { 
  getAllProductos, 
  getProductoById, 
  createProducto, 
  updateProducto, 
  deleteProducto, 
  searchProductos 
} from '../controllers/producto.controllers';
import { auth } from '../middlewares/auth';

const router = Router();

// GET /api/producto - Obtener todos los productos (con filtros y paginación)
router.get('/', getAllProductos);

// GET /api/producto/search - Buscar productos
router.get('/search', searchProductos);

// GET /api/producto/:id - Obtener producto por ID
router.get('/:id', getProductoById);

// POST /api/producto - Crear nuevo producto (requiere autenticación)
router.post('/', auth, createProducto);

// PUT /api/producto/:id - Actualizar producto (requiere autenticación)
router.put('/:id', auth, updateProducto);

// DELETE /api/producto/:id - Eliminar producto (requiere autenticación)
router.delete('/:id', auth, deleteProducto);

export default router;
