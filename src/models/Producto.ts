import mongoose, { Document, Schema } from 'mongoose';
import Joi from 'joi';

// Interface para el documento Producto
export interface IProducto extends Document {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  stock: number;
  imagen?: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  _id: mongoose.Types.ObjectId;
}

// Schema de Mongoose
const productoSchema = new Schema<IProducto>({
  nombre: { type: String, required: true, trim: true },
  descripcion: { type: String, required: true, trim: true },
  precio: { type: Number, required: true, min: 0 },
  categoria: { type: String, required: true, trim: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
  imagen: { type: String, trim: true },
  activo: { type: Boolean, default: true },
  fechaCreacion: { type: Date, default: Date.now },
  fechaActualizacion: { type: Date, default: Date.now }
});

// Middleware pre-save para actualizar fechaActualizacion
productoSchema.pre<IProducto>('save', function(next) {
  this.fechaActualizacion = new Date();
  next();
});

// Schema de validación Joi
export const productoJoiSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required(),
  descripcion: Joi.string().min(10).max(500).required(),
  precio: Joi.number().positive().required(),
  categoria: Joi.string().min(2).max(50).required(),
  stock: Joi.number().min(0).required(),
  imagen: Joi.string().uri().optional(),
  activo: Joi.boolean().optional()
});

// Interface para crear producto
export interface ICreateProductoRequest {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  stock: number;
  imagen?: string;
  activo?: boolean;
}

// Interface para actualizar producto
export interface IUpdateProductoRequest {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  categoria?: string;
  stock?: number;
  imagen?: string;
  activo?: boolean;
}

// Interface para respuesta de producto
export interface IProductoResponse {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  stock: number;
  imagen?: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

// Modelo exportado
export const Producto = mongoose.model<IProducto>('Producto', productoSchema);
