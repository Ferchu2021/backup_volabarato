import mongoose, { Document, Schema } from 'mongoose';
import Joi from 'joi';

// Interface para el documento Suscriptor
export interface ISuscriptor extends Document {
  nombre: string;
  apellido: string;
  email: string;
  pais: string;
  ciudad: string;
  fechaSuscripcion: Date;
  activo: boolean;
  fechaDesuscripcion?: Date;
  _id: mongoose.Types.ObjectId;
}

// Schema de Mongoose
const suscriptorSchema = new Schema<ISuscriptor>({
  nombre: { type: String, required: true, trim: true },
  apellido: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  pais: { type: String, required: true, trim: true },
  ciudad: { type: String, required: true, trim: true },
  fechaSuscripcion: { type: Date, default: Date.now },
  activo: { type: Boolean, default: true },
  fechaDesuscripcion: { type: Date }
});

// Índices
// suscriptorSchema.index({ email: 1 }); // Removido: unique: true ya crea el índice
suscriptorSchema.index({ activo: 1 });
suscriptorSchema.index({ pais: 1 });

// Modelo exportado
export const Suscriptor = mongoose.model<ISuscriptor>('Suscriptor', suscriptorSchema);

// Schema de validación Joi
export const suscriptorJoiSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required(),
  apellido: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  pais: Joi.string().min(2).max(100).required(),
  ciudad: Joi.string().min(2).max(100).required()
});

// Interface para crear suscriptor
export interface ICreateSuscriptorRequest {
  nombre: string;
  apellido: string;
  email: string;
  pais: string;
  ciudad: string;
}

// Interface para actualizar suscriptor
export interface IUpdateSuscriptorRequest {
  nombre?: string;
  apellido?: string;
  email?: string;
  pais?: string;
  ciudad?: string;
  activo?: boolean;
}

