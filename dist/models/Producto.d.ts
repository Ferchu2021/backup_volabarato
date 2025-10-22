import mongoose, { Document } from 'mongoose';
import Joi from 'joi';
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
export declare const productoJoiSchema: Joi.ObjectSchema<any>;
export interface ICreateProductoRequest {
    nombre: string;
    descripcion: string;
    precio: number;
    categoria: string;
    stock: number;
    imagen?: string;
    activo?: boolean;
}
export interface IUpdateProductoRequest {
    nombre?: string;
    descripcion?: string;
    precio?: number;
    categoria?: string;
    stock?: number;
    imagen?: string;
    activo?: boolean;
}
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
export declare const Producto: mongoose.Model<IProducto, {}, {}, {}, mongoose.Document<unknown, {}, IProducto> & IProducto & Required<{
    _id: mongoose.Types.ObjectId;
}>, any>;
//# sourceMappingURL=Producto.d.ts.map