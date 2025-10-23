import { Request, Response } from 'express';
import { Producto, productoJoiSchema, ICreateProductoRequest, IUpdateProductoRequest, IProductoResponse } from '../models/Producto';

// Interface para respuesta de error
export interface IErrorResponse {
  error: string;
  details?: string;
  message?: string;
}

// Controller para obtener todos los productos
export const getAllProductos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoria, activo, limit = 10, page = 1 } = req.query;
    
    // Construir filtros
    const filters: any = {};
    if (categoria) filters.categoria = categoria;
    if (activo !== undefined) filters.activo = activo === 'true';
    
    // Paginación
    const skip = (Number(page) - 1) * Number(limit);
    
    const productos = await Producto.find(filters)
      .sort({ fechaCreacion: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Producto.countDocuments(filters);
    
    res.json({
      productos,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para obtener un producto por ID
export const getProductoById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      const errorResponse: IErrorResponse = {
        error: 'ID del producto es requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const producto = await Producto.findById(id);

    if (!producto) {
      const errorResponse: IErrorResponse = {
        error: 'Producto no encontrado'
      };
      res.status(404).json(errorResponse);
      return;
    }

    res.json(producto);
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para crear un nuevo producto
export const createProducto = async (req: Request<{}, {}, ICreateProductoRequest>, res: Response): Promise<void> => {
  try {
    const { error } = productoJoiSchema.validate(req.body);
    if (error) {
      const errorResponse: IErrorResponse = {
        error: 'Datos de validación incorrectos',
        details: error.details[0]?.message || 'Error de validación'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const producto = new Producto(req.body);
    await producto.save();
    
    res.status(201).json({
      message: 'Producto creado exitosamente',
      producto
    });
  } catch (error: any) {
    console.error('Error creando producto:', error);
    
    if (error.code === 11000) {
      const errorResponse: IErrorResponse = {
        error: 'El producto ya existe',
        message: 'Intenta con un nombre diferente'
      };
      res.status(400).json(errorResponse);
      return;
    }
    
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para actualizar un producto
export const updateProducto = async (req: Request<{ id: string }, {}, IUpdateProductoRequest>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      const errorResponse: IErrorResponse = {
        error: 'ID del producto es requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const { error } = productoJoiSchema.validate(req.body);
    if (error) {
      const errorResponse: IErrorResponse = {
        error: 'Datos de validación incorrectos',
        details: error.details[0]?.message || 'Error de validación'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const producto = await Producto.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!producto) {
      const errorResponse: IErrorResponse = {
        error: 'Producto no encontrado'
      };
      res.status(404).json(errorResponse);
      return;
    }

    res.json({
      message: 'Producto actualizado exitosamente',
      producto
    });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para eliminar un producto (baja lógica)
export const deleteProducto = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      const errorResponse: IErrorResponse = {
        error: 'ID del producto es requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const producto = await Producto.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );

    if (!producto) {
      const errorResponse: IErrorResponse = {
        error: 'Producto no encontrado'
      };
      res.status(404).json(errorResponse);
      return;
    }

    res.json({
      message: 'Producto eliminado exitosamente (baja lógica)',
      producto
    });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para buscar productos
export const searchProductos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, categoria, precioMin, precioMax } = req.query;
    
    if (!q) {
      const errorResponse: IErrorResponse = {
        error: 'Término de búsqueda es requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const filters: any = {
      $or: [
        { nombre: { $regex: q, $options: 'i' } },
        { descripcion: { $regex: q, $options: 'i' } },
        { categoria: { $regex: q, $options: 'i' } }
      ],
      activo: true
    };

    if (categoria) filters.categoria = categoria;
    if (precioMin || precioMax) {
      filters.precio = {};
      if (precioMin) filters.precio.$gte = Number(precioMin);
      if (precioMax) filters.precio.$lte = Number(precioMax);
    }

    const productos = await Producto.find(filters).sort({ fechaCreacion: -1 });

    res.json({
      productos,
      total: productos.length,
      query: q
    });
  } catch (error) {
    console.error('Error buscando productos:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Exportar todos los controllers
export default {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  searchProductos
};
