import { Request, Response } from 'express';
import { Destino, destinoJoiSchema, ICreateDestinoRequest, IUpdateDestinoRequest, IDestinoResponse } from '../models/Destino';

// Interface para respuesta de error
export interface IErrorResponse {
  error: string;
  details?: string;
  message?: string;
}

// Controller para obtener todos los destinos
export const getAllDestinos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pais, activo, limit = 10, page = 1 } = req.query;
    
    // Construir filtros
    const filters: any = {};
    if (pais) filters.pais = pais;
    if (activo !== undefined) filters.activo = activo === 'true';
    
    // Paginación
    const skip = (Number(page) - 1) * Number(limit);
    
    const destinos = await Destino.find(filters)
      .sort({ fechaCreacion: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Destino.countDocuments(filters);
    
    res.json({
      destinos,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error obteniendo destinos:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para obtener un destino por ID
export const getDestinoById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      const errorResponse: IErrorResponse = {
        error: 'ID del destino es requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const destino = await Destino.findById(id);

    if (!destino) {
      const errorResponse: IErrorResponse = {
        error: 'Destino no encontrado'
      };
      res.status(404).json(errorResponse);
      return;
    }

    res.json(destino);
  } catch (error) {
    console.error('Error obteniendo destino:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para crear un nuevo destino
export const createDestino = async (req: Request<{}, {}, ICreateDestinoRequest>, res: Response): Promise<void> => {
  try {
    const { error } = destinoJoiSchema.validate(req.body);
    if (error) {
      const errorResponse: IErrorResponse = {
        error: 'Datos de validación incorrectos',
        details: error.details[0]?.message || 'Error de validación'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const destino = new Destino(req.body);
    await destino.save();
    
    res.status(201).json({
      message: 'Destino creado exitosamente',
      destino
    });
  } catch (error: any) {
    console.error('Error creando destino:', error);
    
    if (error.code === 11000) {
      const errorResponse: IErrorResponse = {
        error: 'El destino ya existe',
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

// Controller para actualizar un destino
export const updateDestino = async (req: Request<{ id: string }, {}, IUpdateDestinoRequest>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      const errorResponse: IErrorResponse = {
        error: 'ID del destino es requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const { error } = destinoJoiSchema.validate(req.body);
    if (error) {
      const errorResponse: IErrorResponse = {
        error: 'Datos de validación incorrectos',
        details: error.details[0]?.message || 'Error de validación'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const destino = await Destino.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!destino) {
      const errorResponse: IErrorResponse = {
        error: 'Destino no encontrado'
      };
      res.status(404).json(errorResponse);
      return;
    }

    res.json({
      message: 'Destino actualizado exitosamente',
      destino
    });
  } catch (error) {
    console.error('Error actualizando destino:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para eliminar un destino (baja lógica)
export const deleteDestino = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      const errorResponse: IErrorResponse = {
        error: 'ID del destino es requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const destino = await Destino.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );

    if (!destino) {
      const errorResponse: IErrorResponse = {
        error: 'Destino no encontrado'
      };
      res.status(404).json(errorResponse);
      return;
    }

    res.json({
      message: 'Destino eliminado exitosamente (baja lógica)',
      destino
    });
  } catch (error) {
    console.error('Error eliminando destino:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para buscar destinos
export const searchDestinos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, pais, clima } = req.query;
    
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
        { pais: { $regex: q, $options: 'i' } },
        { ciudad: { $regex: q, $options: 'i' } },
        { descripcion: { $regex: q, $options: 'i' } },
        { actividades: { $in: [new RegExp(q as string, 'i')] } }
      ],
      activo: true
    };

    if (pais) filters.pais = pais;
    if (clima) filters.clima = clima;

    const destinos = await Destino.find(filters).sort({ fechaCreacion: -1 });

    res.json({
      destinos,
      total: destinos.length,
      query: q
    });
  } catch (error) {
    console.error('Error buscando destinos:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para obtener destinos por país
export const getDestinosByPais = async (req: Request<{ pais: string }>, res: Response): Promise<void> => {
  try {
    const { pais } = req.params;
    
    if (!pais) {
      const errorResponse: IErrorResponse = {
        error: 'País es requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const destinos = await Destino.find({ 
      pais: { $regex: pais, $options: 'i' },
      activo: true 
    }).sort({ ciudad: 1 });

    res.json({
      destinos,
      total: destinos.length,
      pais
    });
  } catch (error) {
    console.error('Error obteniendo destinos por país:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para obtener destinos por clima
export const getDestinosByClima = async (req: Request<{ clima: string }>, res: Response): Promise<void> => {
  try {
    const { clima } = req.params;
    
    if (!clima) {
      const errorResponse: IErrorResponse = {
        error: 'Clima es requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const destinos = await Destino.find({ 
      clima: { $regex: clima, $options: 'i' },
      activo: true 
    }).sort({ nombre: 1 });

    res.json({
      destinos,
      total: destinos.length,
      clima
    });
  } catch (error) {
    console.error('Error obteniendo destinos por clima:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Exportar todos los controllers
export default {
  getAllDestinos,
  getDestinoById,
  createDestino,
  updateDestino,
  deleteDestino,
  searchDestinos,
  getDestinosByPais,
  getDestinosByClima
};
