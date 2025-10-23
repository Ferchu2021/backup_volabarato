import mongoose, { Document, Schema } from 'mongoose';
import Joi from 'joi';

// Interface para el documento Destino
export interface IDestino extends Document {
  nombre: string;
  pais: string;
  ciudad: string;
  descripcion: string;
  clima: string;
  mejorEpoca: string;
  actividades: string[];
  imagen?: string;
  coordenadas: {
    latitud: number;
    longitud: number;
  };
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  _id: mongoose.Types.ObjectId;
}

// Schema de Mongoose
const destinoSchema = new Schema<IDestino>({
  nombre: { type: String, required: true, trim: true },
  pais: { type: String, required: true, trim: true },
  ciudad: { type: String, required: true, trim: true },
  descripcion: { type: String, required: true, trim: true },
  clima: { type: String, required: true, trim: true },
  mejorEpoca: { type: String, required: true, trim: true },
  actividades: [{ type: String, trim: true }],
  imagen: { type: String, trim: true },
  coordenadas: {
    latitud: { type: Number, required: true, min: -90, max: 90 },
    longitud: { type: Number, required: true, min: -180, max: 180 }
  },
  activo: { type: Boolean, default: true },
  fechaCreacion: { type: Date, default: Date.now },
  fechaActualizacion: { type: Date, default: Date.now }
});

// Middleware pre-save para actualizar fechaActualizacion
destinoSchema.pre<IDestino>('save', function(next) {
  this.fechaActualizacion = new Date();
  next();
});

// Schema de validación Joi
export const destinoJoiSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required(),
  pais: Joi.string().min(2).max(50).required(),
  ciudad: Joi.string().min(2).max(50).required(),
  descripcion: Joi.string().min(10).max(1000).required(),
  clima: Joi.string().min(2).max(100).required(),
  mejorEpoca: Joi.string().min(2).max(100).required(),
  actividades: Joi.array().items(Joi.string().trim()).min(1).required(),
  imagen: Joi.string().uri().optional(),
  coordenadas: Joi.object({
    latitud: Joi.number().min(-90).max(90).required(),
    longitud: Joi.number().min(-180).max(180).required()
  }).required(),
  activo: Joi.boolean().optional()
});

// Interface para crear destino
export interface ICreateDestinoRequest {
  nombre: string;
  pais: string;
  ciudad: string;
  descripcion: string;
  clima: string;
  mejorEpoca: string;
  actividades: string[];
  imagen?: string;
  coordenadas: {
    latitud: number;
    longitud: number;
  };
  activo?: boolean;
}

// Interface para actualizar destino
export interface IUpdateDestinoRequest {
  nombre?: string;
  pais?: string;
  ciudad?: string;
  descripcion?: string;
  clima?: string;
  mejorEpoca?: string;
  actividades?: string[];
  imagen?: string;
  coordenadas?: {
    latitud: number;
    longitud: number;
  };
  activo?: boolean;
}

// Interface para respuesta de destino
export interface IDestinoResponse {
  _id: string;
  nombre: string;
  pais: string;
  ciudad: string;
  descripcion: string;
  clima: string;
  mejorEpoca: string;
  actividades: string[];
  imagen?: string;
  coordenadas: {
    latitud: number;
    longitud: number;
  };
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

// Modelo exportado
export const Destino = mongoose.model<IDestino>('Destino', destinoSchema);
