import mongoose, { Document, Schema } from 'mongoose';
import Joi from 'joi';

// Interface para el documento Reserva
export interface IReserva extends Document {
  numeroReserva?: string;
  usuario: mongoose.Types.ObjectId;
  paquete: mongoose.Types.ObjectId;
  fechaReserva: Date;
  fechaViaje: Date;
  cantidadPersonas: number;
  precioTotal: number;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  observaciones?: string;
  datosContacto: {
    nombre: string;
    email: string;
    telefono: string;
  };
  fechaCreacion: Date;
  fechaActualizacion: Date;
  _id: mongoose.Types.ObjectId;
}

// Schema de Mongoose
const reservaSchema = new Schema<IReserva>({
  numeroReserva: { 
    type: String, 
    required: false, 
    unique: true,
    index: true
  },
  usuario: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  paquete: { 
    type: Schema.Types.ObjectId, 
    ref: 'Paquete', 
    required: true 
  },
  fechaReserva: { 
    type: Date, 
    required: true, 
    default: Date.now 
  },
  fechaViaje: { 
    type: Date, 
    required: true 
  },
  cantidadPersonas: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 20 
  },
  precioTotal: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  estado: { 
    type: String, 
    enum: ['pendiente', 'confirmada', 'cancelada', 'completada'], 
    default: 'pendiente' 
  },
  metodoPago: { 
    type: String, 
    enum: ['efectivo', 'tarjeta', 'transferencia'], 
    required: true 
  },
  observaciones: { 
    type: String, 
    trim: true, 
    maxlength: 500 
  },
  datosContacto: {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    telefono: { type: String, required: true, trim: true }
  },
  fechaCreacion: { type: Date, default: Date.now },
  fechaActualizacion: { type: Date, default: Date.now }
});

// Middleware pre-save para generar número de reserva y actualizar fechaActualizacion
reservaSchema.pre<IReserva>('save', async function(next) {
  this.fechaActualizacion = new Date();
  
  // Generar número de reserva solo si es un nuevo documento y no tiene número
  if (this.isNew && !this.numeroReserva) {
    const fecha = new Date();
    const fechaStr = fecha.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Generar número único con timestamp y random
    const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    const timestamp = Date.now().toString().slice(-6);
    this.numeroReserva = `RES-${fechaStr}-${timestamp}-${randomNum}`;
  }
  
  next();
});

// Modelo exportado
export const Reserva = mongoose.model<IReserva>('Reserva', reservaSchema);

// Índices para mejorar consultas
reservaSchema.index({ numeroReserva: 1 });
reservaSchema.index({ usuario: 1 });
reservaSchema.index({ paquete: 1 });
reservaSchema.index({ estado: 1 });
reservaSchema.index({ fechaViaje: 1 });
reservaSchema.index({ fechaReserva: -1 });

// Schema de validación Joi (sin usuario, se obtiene del token)
export const reservaJoiSchema = Joi.object({
  paquete: Joi.string().hex().length(24).required(),
  fechaViaje: Joi.date().greater('now').required().messages({
    'date.greater': 'La fecha de viaje debe ser futura',
    'date.base': 'La fecha de viaje debe ser una fecha válida'
  }),
  cantidadPersonas: Joi.number().integer().min(1).max(20).required(),
  precioTotal: Joi.number().positive().required(),
  estado: Joi.string().valid('pendiente', 'confirmada', 'cancelada', 'completada').optional(),
  metodoPago: Joi.string().valid('efectivo', 'tarjeta', 'transferencia').required(),
  observaciones: Joi.string().max(500).allow('', null).optional(),
  datosContacto: Joi.object({
    nombre: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    telefono: Joi.string().min(8).max(20).required()
  }).required()
});

// Interface para crear reserva (usuario se obtiene del JWT token)
export interface ICreateReservaRequest {
  paquete: string;
  fechaViaje: Date;
  cantidadPersonas: number;
  precioTotal: number;
  estado?: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  observaciones?: string;
  datosContacto: {
    nombre: string;
    email: string;
    telefono: string;
  };
}

// Interface para actualizar reserva
export interface IUpdateReservaRequest {
  fechaViaje?: Date;
  cantidadPersonas?: number;
  precioTotal?: number;
  estado?: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  metodoPago?: 'efectivo' | 'tarjeta' | 'transferencia';
  observaciones?: string;
  datosContacto?: {
    nombre?: string;
    email?: string;
    telefono?: string;
  };
}

// Interface para respuesta de reserva
export interface IReservaResponse {
  _id: string;
  numeroReserva: string;
  usuario: string;
  paquete: string;
  fechaReserva: string;
  fechaViaje: string;
  cantidadPersonas: number;
  precioTotal: number;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  observaciones?: string;
  datosContacto: {
    nombre: string;
    email: string;
    telefono: string;
  };
  fechaCreacion: string;
  fechaActualizacion: string;
}

// Interface para respuesta de reserva con datos poblados
export interface IReservaPopulatedResponse {
  _id: string;
  numeroReserva: string;
  usuario: {
    _id: string;
    nombre: string;
    email: string;
  };
  paquete: {
    _id: string;
    nombre: string;
    destino: string;
    precio: number;
  };
  fechaReserva: string;
  fechaViaje: string;
  cantidadPersonas: number;
  precioTotal: number;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  observaciones?: string;
  datosContacto: {
    nombre: string;
    email: string;
    telefono: string;
  };
  fechaCreacion: string;
  fechaActualizacion: string;
}
