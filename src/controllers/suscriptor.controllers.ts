import { Request, Response } from 'express';
import { 
  Suscriptor, 
  suscriptorJoiSchema, 
  ICreateSuscriptorRequest, 
  IUpdateSuscriptorRequest 
} from '../models/Suscriptor';

// Interface para respuesta de error
export interface IErrorResponse {
  error: string;
  details?: string;
  message?: string;
}

// Controller para obtener todos los suscriptores
export const getAllSuscriptores = async (req: Request, res: Response): Promise<void> => {
  try {
    const { activo, limit = 10, page = 1 } = req.query;
    
    // Construir filtros
    const filters: any = {};
    if (activo !== undefined) {
      filters.activo = activo === 'true';
    }
    
    // Paginación
    const skip = (Number(page) - 1) * Number(limit);
    
    const suscriptores = await Suscriptor.find(filters)
      .sort({ fechaSuscripcion: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Suscriptor.countDocuments(filters);
    
    res.json({
      data: suscriptores,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error obteniendo suscriptores:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para obtener un suscriptor por ID
export const getSuscriptorById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      const errorResponse: IErrorResponse = {
        error: 'ID del suscriptor es requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const suscriptor = await Suscriptor.findById(id);

    if (!suscriptor) {
      const errorResponse: IErrorResponse = {
        error: 'Suscriptor no encontrado'
      };
      res.status(404).json(errorResponse);
      return;
    }

    res.json(suscriptor);
  } catch (error) {
    console.error('Error obteniendo suscriptor:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para crear un nuevo suscriptor
export const createSuscriptor = async (req: Request<{}, {}, ICreateSuscriptorRequest>, res: Response): Promise<void> => {
  try {
    const { error } = suscriptorJoiSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorResponse: IErrorResponse = {
        error: 'Datos de validación incorrectos',
        details: error.details.map(d => d.message).join('; ') || 'Error de validación'
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Verificar si el email ya existe
    const existingSuscriptor = await Suscriptor.findOne({ email: req.body.email.toLowerCase() });
    if (existingSuscriptor) {
      const errorResponse: IErrorResponse = {
        error: 'El email ya está suscrito'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const suscriptor = new Suscriptor(req.body);
    await suscriptor.save();
    
    res.status(201).json({
      message: 'Suscriptor creado exitosamente',
      suscriptor
    });
  } catch (error: any) {
    console.error('Error creando suscriptor:', error);
    
    if (error.code === 11000) {
      const errorResponse: IErrorResponse = {
        error: 'El email ya está suscrito'
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

// Controller para actualizar un suscriptor
export const updateSuscriptor = async (req: Request<{ id: string }, {}, IUpdateSuscriptorRequest>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      const errorResponse: IErrorResponse = {
        error: 'ID del suscriptor es requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Si se está actualizando el email, verificar que no esté en uso
    if (req.body.email) {
      const existingSuscriptor = await Suscriptor.findOne({ 
        email: req.body.email.toLowerCase(),
        _id: { $ne: id }
      });
      
      if (existingSuscriptor) {
        const errorResponse: IErrorResponse = {
          error: 'El email ya está en uso por otro suscriptor'
        };
        res.status(400).json(errorResponse);
        return;
      }
    }

    const suscriptor = await Suscriptor.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!suscriptor) {
      const errorResponse: IErrorResponse = {
        error: 'Suscriptor no encontrado'
      };
      res.status(404).json(errorResponse);
      return;
    }

    res.json({
      message: 'Suscriptor actualizado exitosamente',
      suscriptor
    });
  } catch (error) {
    console.error('Error actualizando suscriptor:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para desuscribir un suscriptor
export const desuscribirSuscriptor = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      const errorResponse: IErrorResponse = {
        error: 'ID del suscriptor es requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const suscriptor = await Suscriptor.findByIdAndUpdate(
      id,
      { activo: false, fechaDesuscripcion: new Date() },
      { new: true }
    );

    if (!suscriptor) {
      const errorResponse: IErrorResponse = {
        error: 'Suscriptor no encontrado'
      };
      res.status(404).json(errorResponse);
      return;
    }

    res.json({
      message: 'Suscriptor desuscrito exitosamente',
      suscriptor
    });
  } catch (error) {
    console.error('Error desuscribiendo suscriptor:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para eliminar un suscriptor
export const deleteSuscriptor = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      const errorResponse: IErrorResponse = {
        error: 'ID del suscriptor es requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const suscriptor = await Suscriptor.findByIdAndDelete(id);

    if (!suscriptor) {
      const errorResponse: IErrorResponse = {
        error: 'Suscriptor no encontrado'
      };
      res.status(404).json(errorResponse);
      return;
    }

    res.json({
      message: 'Suscriptor eliminado exitosamente',
      suscriptor
    });
  } catch (error) {
    console.error('Error eliminando suscriptor:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para obtener estadísticas de suscriptores
export const getSuscriptoresStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalSuscriptores = await Suscriptor.countDocuments();
    const suscriptoresActivos = await Suscriptor.countDocuments({ activo: true });
    const suscriptoresInactivos = await Suscriptor.countDocuments({ activo: false });
    
    const porPais = await Suscriptor.aggregate([
      {
        $group: {
          _id: '$pais',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      totalSuscriptores,
      suscriptoresActivos,
      suscriptoresInactivos,
      porPais
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Exportar todos los controllers
export default {
  getAllSuscriptores,
  getSuscriptorById,
  createSuscriptor,
  updateSuscriptor,
  desuscribirSuscriptor,
  deleteSuscriptor,
  getSuscriptoresStats
};

