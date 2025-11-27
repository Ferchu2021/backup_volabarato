import { Request, Response } from 'express';
import { 
  Pago, 
  pagoJoiSchema, 
  ICreatePagoRequest, 
  IUpdatePagoRequest 
} from '../models/Pago.js';
import { Reserva } from '../models/Reserva.js';

// Interface para respuesta de error
export interface IErrorResponse {
  error: string;
  details?: string;
  message?: string;
}

// Controller para obtener todos los pagos
export const getAllPagos = async (req: Request, res: Response): Promise<void> => {
  try {
    // Obtener usuario desde autenticación (JWT o Firebase)
    const { getUserFromRequest } = await import('../helpers/firebaseUserHelper.js');
    const user = await getUserFromRequest(req);
    
    if (!user) {
      const errorResponse: IErrorResponse = {
        error: 'Usuario no encontrado',
        message: 'No se pudo identificar al usuario. Verifica tu autenticación.'
      };
      res.status(401).json(errorResponse);
      return;
    }

    const { estado, metodoPago, reserva, limit = 10, page = 1 } = req.query;
    
    // Construir filtros
    const filters: any = {};
    if (estado) filters.estado = estado;
    if (metodoPago) filters.metodoPago = metodoPago;
    if (reserva) filters.reserva = reserva;
    
    // Si no es admin, solo mostrar pagos de sus propias reservas
    if (user.rol !== 'admin') {
      // Obtener todas las reservas del usuario
      const { Reserva } = await import('../models/Reserva.js');
      const reservasUsuario = await Reserva.find({ usuario: user._id }).select('_id');
      const reservasIds = reservasUsuario.map(r => r._id);
      
      // Filtrar pagos solo de las reservas del usuario
      filters.reserva = { $in: reservasIds };
    }
    
    // Paginación
    const skip = (Number(page) - 1) * Number(limit);
    
    const pagos = await Pago.find(filters)
      .populate('reserva', 'numeroReserva precioTotal datosContacto')
      .sort({ fechaCreacion: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Pago.countDocuments(filters);
    
    res.json({
      data: pagos,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error obteniendo pagos:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para obtener un pago por ID
export const getPagoById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      const errorResponse: IErrorResponse = {
        error: 'ID del pago es requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const pago = await Pago.findById(id)
      .populate('reserva', 'numeroReserva precioTotal datosContacto paquete');

    if (!pago) {
      const errorResponse: IErrorResponse = {
        error: 'Pago no encontrado'
      };
      res.status(404).json(errorResponse);
      return;
    }

    res.json(pago);
  } catch (error) {
    console.error('Error obteniendo pago:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para obtener pago por reserva
export const getPagoByReserva = async (req: Request<{ reservaId: string }>, res: Response): Promise<void> => {
  try {
    const { reservaId } = req.params;
    
    if (!reservaId) {
      const errorResponse: IErrorResponse = {
        error: 'ID de la reserva es requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Obtener usuario desde autenticación (JWT o Firebase)
    const { getUserFromRequest } = await import('../helpers/firebaseUserHelper.js');
    const user = await getUserFromRequest(req);
    
    if (!user) {
      const errorResponse: IErrorResponse = {
        error: 'Usuario no encontrado',
        message: 'No se pudo identificar al usuario. Verifica tu autenticación.'
      };
      res.status(401).json(errorResponse);
      return;
    }

    // Verificar que la reserva existe y pertenece al usuario (si no es admin)
    const { Reserva } = await import('../models/Reserva.js');
    const reserva = await Reserva.findById(reservaId);
    
    if (!reserva) {
      const errorResponse: IErrorResponse = {
        error: 'Reserva no encontrada'
      };
      res.status(404).json(errorResponse);
      return;
    }

    // Verificar permisos: solo el dueño de la reserva o un admin puede ver el pago
    const esAdmin = user.rol === 'admin';
    const esDueño = reserva.usuario.toString() === user._id.toString();
    
    if (!esAdmin && !esDueño) {
      const errorResponse: IErrorResponse = {
        error: 'Acceso denegado',
        message: 'Solo puedes ver pagos de tus propias reservas'
      };
      res.status(403).json(errorResponse);
      return;
    }

    const pago = await Pago.findOne({ reserva: reservaId })
      .populate('reserva', 'numeroReserva precioTotal datosContacto paquete');

    if (!pago) {
      const errorResponse: IErrorResponse = {
        error: 'Pago no encontrado para esta reserva'
      };
      res.status(404).json(errorResponse);
      return;
    }

    res.json(pago);
  } catch (error) {
    console.error('Error obteniendo pago por reserva:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para crear un nuevo pago
export const createPago = async (req: Request<{}, {}, ICreatePagoRequest>, res: Response): Promise<void> => {
  try {
    // Obtener usuario desde autenticación (JWT o Firebase)
    const { getUserFromRequest } = await import('../helpers/firebaseUserHelper.js');
    const user = await getUserFromRequest(req);
    
    if (!user) {
      const errorResponse: IErrorResponse = {
        error: 'Usuario no encontrado',
        message: 'No se pudo identificar al usuario. Verifica tu autenticación.'
      };
      res.status(401).json(errorResponse);
      return;
    }

    const { error } = pagoJoiSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorResponse: IErrorResponse = {
        error: 'Datos de validación incorrectos',
        details: error.details.map(d => d.message).join('; ') || 'Error de validación'
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Verificar que la reserva existe
    const reserva = await Reserva.findById(req.body.reserva);
    if (!reserva) {
      const errorResponse: IErrorResponse = {
        error: 'Reserva no encontrada'
      };
      res.status(404).json(errorResponse);
      return;
    }

    // Verificar permisos: solo el dueño de la reserva o un admin puede crear pagos
    const esAdmin = user.rol === 'admin';
    const esDueño = reserva.usuario.toString() === user._id.toString();
    
    if (!esAdmin && !esDueño) {
      const errorResponse: IErrorResponse = {
        error: 'Acceso denegado',
        message: 'Solo puedes crear pagos para tus propias reservas'
      };
      res.status(403).json(errorResponse);
      return;
    }

    // Verificar que la reserva esté confirmada
    if (reserva.estado !== 'confirmada') {
      const errorResponse: IErrorResponse = {
        error: 'Solo se pueden crear pagos para reservas confirmadas'
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Verificar que no exista ya un pago para esta reserva
    const pagoExistente = await Pago.findOne({ reserva: req.body.reserva });
    if (pagoExistente) {
      const errorResponse: IErrorResponse = {
        error: 'Ya existe un pago para esta reserva'
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Calcular fecha de vencimiento (7 días por defecto si no se especifica)
    const fechaVencimiento = req.body.fechaVencimiento || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const pago = new Pago({
      ...req.body,
      moneda: req.body.moneda || 'ARS',
      fechaVencimiento
    });
    await pago.save();
    
    // Poblar datos para la respuesta
    const pagoPopulado = await Pago.findById(pago._id)
      .populate('reserva', 'numeroReserva precioTotal datosContacto paquete');
    
    res.status(201).json({
      message: 'Pago creado exitosamente',
      pago: pagoPopulado
    });
  } catch (error: any) {
    console.error('Error creando pago:', error);
    
    if (error.code === 11000) {
      const errorResponse: IErrorResponse = {
        error: 'Ya existe un pago para esta reserva'
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

// Controller para actualizar un pago
export const updatePago = async (req: Request<{ id: string }, {}, IUpdatePagoRequest>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      const errorResponse: IErrorResponse = {
        error: 'ID del pago es requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Obtener usuario desde autenticación (JWT o Firebase)
    const { getUserFromRequest } = await import('../helpers/firebaseUserHelper.js');
    const user = await getUserFromRequest(req);
    
    if (!user) {
      const errorResponse: IErrorResponse = {
        error: 'Usuario no encontrado',
        message: 'No se pudo identificar al usuario. Verifica tu autenticación.'
      };
      res.status(401).json(errorResponse);
      return;
    }

    // Buscar el pago primero para verificar permisos
    const pagoExistente = await Pago.findById(id).populate('reserva');
    
    if (!pagoExistente) {
      const errorResponse: IErrorResponse = {
        error: 'Pago no encontrado'
      };
      res.status(404).json(errorResponse);
      return;
    }

    // Verificar permisos: solo el dueño de la reserva asociada o un admin puede actualizar
    const esAdmin = user.rol === 'admin';
    const reserva = pagoExistente.reserva as any;
    const esDueño = reserva && reserva.usuario && reserva.usuario.toString() === user._id.toString();
    
    if (!esAdmin && !esDueño) {
      const errorResponse: IErrorResponse = {
        error: 'Acceso denegado',
        message: 'Solo puedes actualizar pagos de tus propias reservas'
      };
      res.status(403).json(errorResponse);
      return;
    }

    const pago = await Pago.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('reserva', 'numeroReserva precioTotal datosContacto paquete');

    if (!pago) {
      const errorResponse: IErrorResponse = {
        error: 'Pago no encontrado'
      };
      res.status(404).json(errorResponse);
      return;
    }

    // Si el pago se marca como completado, actualizar la fecha de pago
    if (req.body.estado === 'completado' && !pago.fechaPago) {
      pago.fechaPago = new Date();
      await pago.save();
    }

    res.json({
      message: 'Pago actualizado exitosamente',
      pago
    });
  } catch (error) {
    console.error('Error actualizando pago:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para marcar pago como completado
export const completarPago = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { referencia, datosPago } = req.body;
    
    if (!id) {
      const errorResponse: IErrorResponse = {
        error: 'ID del pago es requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Obtener usuario desde autenticación (JWT o Firebase)
    const { getUserFromRequest } = await import('../helpers/firebaseUserHelper.js');
    const user = await getUserFromRequest(req);
    
    if (!user) {
      const errorResponse: IErrorResponse = {
        error: 'Usuario no encontrado',
        message: 'No se pudo identificar al usuario. Verifica tu autenticación.'
      };
      res.status(401).json(errorResponse);
      return;
    }

    // Buscar el pago primero para verificar permisos
    const pagoExistente = await Pago.findById(id).populate('reserva');
    
    if (!pagoExistente) {
      const errorResponse: IErrorResponse = {
        error: 'Pago no encontrado'
      };
      res.status(404).json(errorResponse);
      return;
    }

    // Verificar permisos: solo el dueño de la reserva asociada o un admin puede completar
    const esAdmin = user.rol === 'admin';
    const reserva = pagoExistente.reserva as any;
    const esDueño = reserva && reserva.usuario && reserva.usuario.toString() === user._id.toString();
    
    if (!esAdmin && !esDueño) {
      const errorResponse: IErrorResponse = {
        error: 'Acceso denegado',
        message: 'Solo puedes completar pagos de tus propias reservas'
      };
      res.status(403).json(errorResponse);
      return;
    }

    const pago = await Pago.findByIdAndUpdate(
      id,
      { 
        estado: 'completado',
        fechaPago: new Date(),
        referencia,
        datosPago
      },
      { new: true, runValidators: true }
    )
    .populate('reserva', 'numeroReserva precioTotal datosContacto paquete');

    if (!pago) {
      const errorResponse: IErrorResponse = {
        error: 'Pago no encontrado'
      };
      res.status(404).json(errorResponse);
      return;
    }

    res.json({
      message: 'Pago completado exitosamente',
      pago
    });
  } catch (error) {
    console.error('Error completando pago:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para eliminar un pago
export const deletePago = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      const errorResponse: IErrorResponse = {
        error: 'ID del pago es requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Obtener usuario desde autenticación (JWT o Firebase)
    const { getUserFromRequest } = await import('../helpers/firebaseUserHelper.js');
    const user = await getUserFromRequest(req);
    
    if (!user) {
      const errorResponse: IErrorResponse = {
        error: 'Usuario no encontrado',
        message: 'No se pudo identificar al usuario. Verifica tu autenticación.'
      };
      res.status(401).json(errorResponse);
      return;
    }

    // Buscar el pago primero para verificar permisos
    const pagoExistente = await Pago.findById(id).populate('reserva');
    
    if (!pagoExistente) {
      const errorResponse: IErrorResponse = {
        error: 'Pago no encontrado'
      };
      res.status(404).json(errorResponse);
      return;
    }

    // Verificar permisos: solo el dueño de la reserva asociada o un admin puede eliminar
    const esAdmin = user.rol === 'admin';
    const reserva = pagoExistente.reserva as any;
    const esDueño = reserva && reserva.usuario && reserva.usuario.toString() === user._id.toString();
    
    if (!esAdmin && !esDueño) {
      const errorResponse: IErrorResponse = {
        error: 'Acceso denegado',
        message: 'Solo puedes eliminar pagos de tus propias reservas'
      };
      res.status(403).json(errorResponse);
      return;
    }

    const pago = await Pago.findByIdAndDelete(id);

    if (!pago) {
      const errorResponse: IErrorResponse = {
        error: 'Pago no encontrado'
      };
      res.status(404).json(errorResponse);
      return;
    }

    res.json({
      message: 'Pago eliminado exitosamente',
      pago
    });
  } catch (error) {
    console.error('Error eliminando pago:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Exportar todos los controllers
export default {
  getAllPagos,
  getPagoById,
  getPagoByReserva,
  createPago,
  updatePago,
  completarPago,
  deletePago
};

