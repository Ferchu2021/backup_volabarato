import mongoose, { Document, Schema } from 'mongoose';
import Joi from 'joi';

// Interface para el documento Pago
export interface IPago extends Document {
  reserva: mongoose.Types.ObjectId;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  monto: number;
  moneda: string;
  estado: 'pendiente' | 'procesando' | 'completado' | 'rechazado' | 'cancelado';
  fechaPago?: Date;
  fechaVencimiento?: Date;
  referencia?: string; // Número de referencia, comprobante, etc.
  datosPago?: {
    // Para tarjeta
    numeroTarjeta?: string; // Últimos 4 dígitos
    tipoTarjeta?: string; // Visa, Mastercard, etc.
    // Para transferencia
    numeroComprobante?: string;
    banco?: string;
    cuenta?: string;
    // Para efectivo
    lugarPago?: string;
    recibidoPor?: string;
  };
  observaciones?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  _id: mongoose.Types.ObjectId;
}

// Schema de Mongoose
const pagoSchema = new Schema<IPago>({
  reserva: { 
    type: Schema.Types.ObjectId, 
    ref: 'Reserva', 
    required: true,
    unique: true // Un pago por reserva
  },
  metodoPago: { 
    type: String, 
    enum: ['efectivo', 'tarjeta', 'transferencia'], 
    required: true 
  },
  monto: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  moneda: { 
    type: String, 
    enum: ['USD', 'ARS', 'BRL', 'MXN', 'EUR', 'COP', 'CLP', 'PEN'],
    default: 'ARS',
    required: true
  },
  estado: { 
    type: String, 
    enum: ['pendiente', 'procesando', 'completado', 'rechazado', 'cancelado'], 
    default: 'pendiente',
    required: true
  },
  fechaPago: { 
    type: Date 
  },
  fechaVencimiento: { 
    type: Date 
  },
  referencia: { 
    type: String, 
    trim: true 
  },
  datosPago: {
    numeroTarjeta: { type: String, trim: true },
    tipoTarjeta: { type: String, trim: true },
    numeroComprobante: { type: String, trim: true },
    banco: { type: String, trim: true },
    cuenta: { type: String, trim: true },
    lugarPago: { type: String, trim: true },
    recibidoPor: { type: String, trim: true }
  },
  observaciones: { 
    type: String, 
    trim: true, 
    maxlength: 500 
  },
  fechaCreacion: { type: Date, default: Date.now },
  fechaActualizacion: { type: Date, default: Date.now }
});

// Middleware pre-save para actualizar fechaActualizacion
pagoSchema.pre<IPago>('save', function(next) {
  this.fechaActualizacion = new Date();
  next();
});

// Índices
pagoSchema.index({ reserva: 1 });
pagoSchema.index({ estado: 1 });
pagoSchema.index({ metodoPago: 1 });
pagoSchema.index({ fechaCreacion: -1 });

// Modelo exportado
export const Pago = mongoose.model<IPago>('Pago', pagoSchema);

// Schema de validación Joi
export const pagoJoiSchema = Joi.object({
  reserva: Joi.string().hex().length(24).required(),
  metodoPago: Joi.string().valid('efectivo', 'tarjeta', 'transferencia').required(),
  monto: Joi.number().positive().required(),
  moneda: Joi.string().valid('USD', 'ARS', 'BRL', 'MXN', 'EUR', 'COP', 'CLP', 'PEN').optional(),
  estado: Joi.string().valid('pendiente', 'procesando', 'completado', 'rechazado', 'cancelado').optional(),
  fechaPago: Joi.date().optional(),
  fechaVencimiento: Joi.date().optional(),
  referencia: Joi.string().max(100).optional(),
  datosPago: Joi.object({
    numeroTarjeta: Joi.string().max(4).optional(),
    tipoTarjeta: Joi.string().optional(),
    numeroComprobante: Joi.string().optional(),
    banco: Joi.string().optional(),
    cuenta: Joi.string().optional(),
    lugarPago: Joi.string().optional(),
    recibidoPor: Joi.string().optional()
  }).optional(),
  observaciones: Joi.string().max(500).optional()
});

// Interface para crear pago
export interface ICreatePagoRequest {
  reserva: string;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  monto: number;
  moneda?: string;
  fechaVencimiento?: Date;
  datosPago?: {
    numeroTarjeta?: string;
    tipoTarjeta?: string;
    numeroComprobante?: string;
    banco?: string;
    cuenta?: string;
    lugarPago?: string;
    recibidoPor?: string;
  };
  observaciones?: string;
}

// Interface para actualizar pago
export interface IUpdatePagoRequest {
  estado?: 'pendiente' | 'procesando' | 'completado' | 'rechazado' | 'cancelado';
  fechaPago?: Date;
  referencia?: string;
  datosPago?: {
    numeroTarjeta?: string;
    tipoTarjeta?: string;
    numeroComprobante?: string;
    banco?: string;
    cuenta?: string;
    lugarPago?: string;
    recibidoPor?: string;
  };
  observaciones?: string;
}

