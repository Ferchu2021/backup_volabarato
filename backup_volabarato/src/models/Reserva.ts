import mongoose, { Document, Schema } from 'mongoose';
import Joi from 'joi';

// Interface para el documento Reserva
export interface IReserva extends Document {
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

// Middleware pre-save para actualizar fechaActualizacion
reservaSchema.pre<IReserva>('save', function(next) {
  this.fechaActualizacion = new Date();
  next();
});

// Índices para mejorar consultas
reservaSchema.index({ usuario: 1 });
reservaSchema.index({ paquete: 1 });
reservaSchema.index({ estado: 1 });
reservaSchema.index({ fechaViaje: 1 });
reservaSchema.index({ fechaReserva: -1 });

// Schema de validación Joi
export const reservaJoiSchema = Joi.object({
  usuario: Joi.string().hex().length(24).required(),
  paquete: Joi.string().hex().length(24).required(),
  fechaViaje: Joi.date().min('now').required(),
  cantidadPersonas: Joi.number().min(1).max(20).required(),
  precioTotal: Joi.number().positive().required(),
  estado: Joi.string().valid('pendiente', 'confirmada', 'cancelada', 'completada').optional(),
  metodoPago: Joi.string().valid('efectivo', 'tarjeta', 'transferencia').required(),
  observaciones: Joi.string().max(500).optional(),
  datosContacto: Joi.object({
    nombre: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    telefono: Joi.string().min(8).max(20).required()
  }).required()
});

// Interface para crear reserva
export interface ICreateReservaRequest {
  usuario: string;
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

// Modelo exportado
export const Reserva = mongoose.model<IReserva>('Reserva', reservaSchema);
