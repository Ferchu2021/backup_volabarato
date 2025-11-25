import mongoose, { Document, Schema } from 'mongoose';
import Joi from 'joi';

// Interface para el documento Pago
export interface IPago extends Document {
  reserva: mongoose.Types.ObjectId;
  metodoPago: 'tarjeta' | 'transferencia' | 'deposito';
  monto: number;
  moneda: string;
  estado: 'pendiente' | 'procesando' | 'completado' | 'rechazado' | 'cancelado';
  fechaPago?: Date;
  fechaVencimiento?: Date;
  referencia?: string; // Número de referencia, comprobante, etc.
  datosPago?: {
    // Para tarjeta
    numeroTarjeta?: string; // Últimos 4 dígitos
    tipoTarjeta?: string; // crédito o débito
    marcaTarjeta?: string; // Visa, Mastercard, American Express, etc.
    nombreTitular?: string; // Nombre como aparece en la tarjeta
    mesVencimiento?: string; // Mes de vencimiento (01-12)
    anioVencimiento?: string; // Año de vencimiento (2 dígitos)
    // Para transferencia
    numeroComprobante?: string;
    banco?: string;
    cuenta?: string;
    // Para depósito
    numeroComprobanteDeposito?: string;
    bancoDeposito?: string;
    sucursalDeposito?: string;
    fechaDeposito?: string;
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
    unique: true // Un pago por reserva - unique: true crea el índice automáticamente
  },
  metodoPago: { 
    type: String, 
    enum: ['tarjeta', 'transferencia', 'deposito'], 
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
      marcaTarjeta: { type: String, trim: true },
      nombreTitular: { type: String, trim: true },
      mesVencimiento: { type: String, trim: true },
      anioVencimiento: { type: String, trim: true },
      numeroComprobante: { type: String, trim: true },
      banco: { type: String, trim: true },
      cuenta: { type: String, trim: true },
      numeroComprobanteDeposito: { type: String, trim: true },
      bancoDeposito: { type: String, trim: true },
      sucursalDeposito: { type: String, trim: true },
      fechaDeposito: { type: String, trim: true }
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
// pagoSchema.index({ reserva: 1 }); // Removido: unique: true ya crea el índice
pagoSchema.index({ estado: 1 });
pagoSchema.index({ metodoPago: 1 });
pagoSchema.index({ fechaCreacion: -1 });

// Modelo exportado
export const Pago = mongoose.model<IPago>('Pago', pagoSchema);

// Schema de validación Joi
export const pagoJoiSchema = Joi.object({
  reserva: Joi.string().hex().length(24).required(),
  metodoPago: Joi.string().valid('tarjeta', 'transferencia', 'deposito').required(),
  monto: Joi.number().positive().required(),
  moneda: Joi.string().valid('USD', 'ARS', 'BRL', 'MXN', 'EUR', 'COP', 'CLP', 'PEN').optional(),
  estado: Joi.string().valid('pendiente', 'procesando', 'completado', 'rechazado', 'cancelado').optional(),
  fechaPago: Joi.date().optional(),
  fechaVencimiento: Joi.date().optional(),
  referencia: Joi.string().max(100).optional(),
  datosPago: Joi.object({
    numeroTarjeta: Joi.string().max(4).optional(),
    tipoTarjeta: Joi.string().valid('credito', 'debito').optional(),
    marcaTarjeta: Joi.string().valid('visa', 'mastercard', 'american-express', 'otra').optional(),
    nombreTitular: Joi.string().max(100).optional(),
    mesVencimiento: Joi.string().pattern(/^(0[1-9]|1[0-2])$/).optional(),
    anioVencimiento: Joi.string().length(2).optional(),
    numeroComprobante: Joi.string().optional(),
    banco: Joi.string().optional(),
    cuenta: Joi.string().optional(),
    numeroComprobanteDeposito: Joi.string().when('metodoPago', {
      is: 'deposito',
      then: Joi.string().min(1).required(),
      otherwise: Joi.forbidden()
    }),
    bancoDeposito: Joi.string().when('metodoPago', {
      is: 'deposito',
      then: Joi.string().min(1).required(),
      otherwise: Joi.forbidden()
    }),
    sucursalDeposito: Joi.string().when('metodoPago', {
      is: 'deposito',
      then: Joi.string().min(1).optional(),
      otherwise: Joi.forbidden()
    }),
    fechaDeposito: Joi.string().when('metodoPago', {
      is: 'deposito',
      then: Joi.string().optional(),
      otherwise: Joi.forbidden()
    })
  }).optional(),
  observaciones: Joi.string().max(500).optional()
});

// Interface para crear pago
export interface ICreatePagoRequest {
  reserva: string;
  metodoPago: 'tarjeta' | 'transferencia' | 'deposito';
  monto: number;
  moneda?: string;
  fechaVencimiento?: Date;
  datosPago?: {
    numeroTarjeta?: string;
    tipoTarjeta?: string;
    marcaTarjeta?: string;
    nombreTitular?: string;
    mesVencimiento?: string;
    anioVencimiento?: string;
    numeroComprobante?: string;
    banco?: string;
    cuenta?: string;
    numeroComprobanteDeposito?: string;
    bancoDeposito?: string;
    sucursalDeposito?: string;
    fechaDeposito?: string;
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
    marcaTarjeta?: string;
    nombreTitular?: string;
    mesVencimiento?: string;
    anioVencimiento?: string;
    numeroComprobante?: string;
    banco?: string;
    cuenta?: string;
    numeroComprobanteDeposito?: string;
    bancoDeposito?: string;
    sucursalDeposito?: string;
    fechaDeposito?: string;
  };
  observaciones?: string;
}

