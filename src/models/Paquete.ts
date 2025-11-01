import mongoose, { Document, Schema } from 'mongoose';
import Joi from 'joi';

// Interface para el documento Paquete
export interface IPaquete extends Document {
  nombre: string;
  destino: string;
  fecha: Date;
  precio: number;
  descripcion: string;
  activo: boolean;
  _id: mongoose.Types.ObjectId;
}

// Schema de Mongoose
const paqueteSchema = new Schema<IPaquete>({
  nombre: { type: String, required: true },
  destino: { type: String, required: true },
  fecha: { type: Date, required: true },
  precio: { type: Number, required: true, min: 0 },
  descripcion: { type: String },
  activo: { type: Boolean, default: true }
});

// Schema de validación Joi para crear
export const paqueteJoiSchema = Joi.object({
  nombre: Joi.string().required(),
  destino: Joi.string().required(),
  fecha: Joi.date().required(),
  precio: Joi.number().positive().required(),
  descripcion: Joi.string().optional(),
  activo: Joi.boolean()
});

// Schema de validación Joi para actualizar (permite campos opcionales)
export const paqueteUpdateJoiSchema = Joi.object({
  nombre: Joi.string().optional(),
  destino: Joi.string().optional(),
  fecha: Joi.date().optional(),
  precio: Joi.number().positive().optional(),
  descripcion: Joi.string().allow(null, '').optional(),
  activo: Joi.boolean().optional()
}).min(1).unknown(false); // Requiere al menos un campo para actualizar

// Interface para crear paquete
export interface ICreatePaqueteRequest {
  nombre: string;
  destino: string;
  fecha: Date;
  precio: number;
  descripcion?: string;
  activo?: boolean;
}

// Interface para actualizar paquete
export interface IUpdatePaqueteRequest {
  nombre?: string;
  destino?: string;
  fecha?: Date;
  precio?: number;
  descripcion?: string;
  activo?: boolean;
}

// Interface para respuesta de paquete
export interface IPaqueteResponse {
  _id: string;
  nombre: string;
  destino: string;
  fecha: string;
  precio: number;
  descripcion?: string;
  activo: boolean;
}

// Modelo exportado
export const Paquete = mongoose.model<IPaquete>('Paquete', paqueteSchema);
