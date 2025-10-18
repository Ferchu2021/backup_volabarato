import { Request, Response } from 'express';
import { 
  Reserva, 
  reservaJoiSchema, 
  ICreateReservaRequest, 
  IUpdateReservaRequest, 
  IReservaResponse,
  IReservaPopulatedResponse 
} from '../models/Reserva';
import { Paquete } from '../models/Paquete';

// Interface para respuesta de error
export interface IErrorResponse {
  error: string;
  details?: string;
  message?: string;
}

// Controller para obtener todas las reservas
export const getAllReservas = async (req: Request, res: Response): Promise<void> => {
  try {
    const { estado, usuario, paquete, limit = 10, page = 1 } = req.query;
    
    // Construir filtros
    const filters: any = {};
    if (estado) filters.estado = estado;
    if (usuario) filters.usuario = usuario;
    if (paquete) filters.paquete = paquete;
    
    // Paginación
    const skip = (Number(page) - 1) * Number(limit);
    
    const reservas = await Reserva.find(filters)
      .populate('usuario', 'nombre email')
      .populate('paquete', 'nombre destino precio')
      .sort({ fechaReserva: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Reserva.countDocuments(filters);
    
    res.json({
      reservas,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error obteniendo reservas:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para obtener una reserva por ID
export const getReservaById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      const errorResponse: IErrorResponse = {
        error: 'ID de la reserva es requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const reserva = await Reserva.findById(id)
      .populate('usuario', 'nombre email')
      .populate('paquete', 'nombre destino precio');

    if (!reserva) {
      const errorResponse: IErrorResponse = {
        error: 'Reserva no encontrada'
      };
      res.status(404).json(errorResponse);
      return;
    }

    res.json(reserva);
  } catch (error) {
    console.error('Error obteniendo reserva:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para obtener reservas de un usuario específico
export const getReservasByUsuario = async (req: Request<{ usuarioId: string }>, res: Response): Promise<void> => {
  try {
    const { usuarioId } = req.params;
    const { estado, limit = 10, page = 1 } = req.query;
    
    if (!usuarioId) {
      const errorResponse: IErrorResponse = {
        error: 'ID del usuario es requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Construir filtros
    const filters: any = { usuario: usuarioId };
    if (estado) filters.estado = estado;
    
    // Paginación
    const skip = (Number(page) - 1) * Number(limit);
    
    const reservas = await Reserva.find(filters)
      .populate('paquete', 'nombre destino precio')
      .sort({ fechaReserva: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Reserva.countDocuments(filters);
    
    res.json({
      reservas,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error obteniendo reservas del usuario:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para crear una nueva reserva
export const createReserva = async (req: Request<{}, {}, ICreateReservaRequest>, res: Response): Promise<void> => {
  try {
    const { error } = reservaJoiSchema.validate(req.body);
    if (error) {
      const errorResponse: IErrorResponse = {
        error: 'Datos de validación incorrectos',
        details: error.details[0]?.message || 'Error de validación'
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Verificar que el paquete existe
    const paquete = await Paquete.findById(req.body.paquete);
    if (!paquete) {
      const errorResponse: IErrorResponse = {
        error: 'Paquete no encontrado'
      };
      res.status(404).json(errorResponse);
      return;
    }

    // Verificar que el paquete está activo
    if (!paquete.activo) {
      const errorResponse: IErrorResponse = {
        error: 'El paquete no está disponible para reservas'
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Verificar que la fecha de viaje es futura
    const fechaViaje = new Date(req.body.fechaViaje);
    if (fechaViaje <= new Date()) {
      const errorResponse: IErrorResponse = {
        error: 'La fecha de viaje debe ser futura'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const reserva = new Reserva(req.body);
    await reserva.save();
    
    // Poblar datos para la respuesta
    const reservaPopulada = await Reserva.findById(reserva._id)
      .populate('usuario', 'nombre email')
      .populate('paquete', 'nombre destino precio');
    
    res.status(201).json({
      message: 'Reserva creada exitosamente',
      reserva: reservaPopulada
    });
  } catch (error: any) {
    console.error('Error creando reserva:', error);
    
    if (error.code === 11000) {
      const errorResponse: IErrorResponse = {
        error: 'La reserva ya existe',
        message: 'Intenta con datos diferentes'
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

// Controller para actualizar una reserva
export const updateReserva = async (req: Request<{ id: string }, {}, IUpdateReservaRequest>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      const errorResponse: IErrorResponse = {
        error: 'ID de la reserva es requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Validar datos de actualización
    const updateSchema = reservaJoiSchema.fork(Object.keys(reservaJoiSchema.describe().keys), (schema) => schema.optional());
    const { error } = updateSchema.validate(req.body);
    if (error) {
      const errorResponse: IErrorResponse = {
        error: 'Datos de validación incorrectos',
        details: error.details[0]?.message || 'Error de validación'
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Verificar que la fecha de viaje es futura si se está actualizando
    if (req.body.fechaViaje) {
      const fechaViaje = new Date(req.body.fechaViaje);
      if (fechaViaje <= new Date()) {
        const errorResponse: IErrorResponse = {
          error: 'La fecha de viaje debe ser futura'
        };
        res.status(400).json(errorResponse);
        return;
      }
    }

    const reserva = await Reserva.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('usuario', 'nombre email')
    .populate('paquete', 'nombre destino precio');

    if (!reserva) {
      const errorResponse: IErrorResponse = {
        error: 'Reserva no encontrada'
      };
      res.status(404).json(errorResponse);
      return;
    }

    res.json({
      message: 'Reserva actualizada exitosamente',
      reserva
    });
  } catch (error) {
    console.error('Error actualizando reserva:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para cancelar una reserva
export const cancelarReserva = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      const errorResponse: IErrorResponse = {
        error: 'ID de la reserva es requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const reserva = await Reserva.findByIdAndUpdate(
      id,
      { estado: 'cancelada' },
      { new: true }
    )
    .populate('usuario', 'nombre email')
    .populate('paquete', 'nombre destino precio');

    if (!reserva) {
      const errorResponse: IErrorResponse = {
        error: 'Reserva no encontrada'
      };
      res.status(404).json(errorResponse);
      return;
    }

    res.json({
      message: 'Reserva cancelada exitosamente',
      reserva
    });
  } catch (error) {
    console.error('Error cancelando reserva:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para confirmar una reserva
export const confirmarReserva = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      const errorResponse: IErrorResponse = {
        error: 'ID de la reserva es requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const reserva = await Reserva.findByIdAndUpdate(
      id,
      { estado: 'confirmada' },
      { new: true }
    )
    .populate('usuario', 'nombre email')
    .populate('paquete', 'nombre destino precio');

    if (!reserva) {
      const errorResponse: IErrorResponse = {
        error: 'Reserva no encontrada'
      };
      res.status(404).json(errorResponse);
      return;
    }

    res.json({
      message: 'Reserva confirmada exitosamente',
      reserva
    });
  } catch (error) {
    console.error('Error confirmando reserva:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para eliminar una reserva (baja lógica)
export const deleteReserva = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      const errorResponse: IErrorResponse = {
        error: 'ID de la reserva es requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const reserva = await Reserva.findByIdAndDelete(id);

    if (!reserva) {
      const errorResponse: IErrorResponse = {
        error: 'Reserva no encontrada'
      };
      res.status(404).json(errorResponse);
      return;
    }

    res.json({
      message: 'Reserva eliminada exitosamente',
      reserva
    });
  } catch (error) {
    console.error('Error eliminando reserva:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para obtener estadísticas de reservas
export const getReservasStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    
    const filters: any = {};
    if (fechaInicio && fechaFin) {
      filters.fechaReserva = {
        $gte: new Date(fechaInicio as string),
        $lte: new Date(fechaFin as string)
      };
    }

    const stats = await Reserva.aggregate([
      { $match: filters },
      {
        $group: {
          _id: '$estado',
          count: { $sum: 1 },
          totalIngresos: { $sum: '$precioTotal' }
        }
      }
    ]);

    const totalReservas = await Reserva.countDocuments(filters);
    const totalIngresos = await Reserva.aggregate([
      { $match: filters },
      { $group: { _id: null, total: { $sum: '$precioTotal' } } }
    ]);

    res.json({
      estadisticas: stats,
      totalReservas,
      totalIngresos: totalIngresos[0]?.total || 0
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
  getAllReservas,
  getReservaById,
  getReservasByUsuario,
  createReserva,
  updateReserva,
  cancelarReserva,
  confirmarReserva,
  deleteReserva,
  getReservasStats
};
