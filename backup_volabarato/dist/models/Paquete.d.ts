import mongoose, { Document } from 'mongoose';
import Joi from 'joi';
export interface IPaquete extends Document {
    nombre: string;
    destino: string;
    fecha: Date;
    precio: number;
    descripcion?: string;
    activo: boolean;
    _id: mongoose.Types.ObjectId;
}
export declare const paqueteJoiSchema: Joi.ObjectSchema<any>;
export interface ICreatePaqueteRequest {
    nombre: string;
    destino: string;
    fecha: Date;
    precio: number;
    descripcion?: string;
    activo?: boolean;
}
export interface IUpdatePaqueteRequest {
    nombre?: string;
    destino?: string;
    fecha?: Date;
    precio?: number;
    descripcion?: string;
    activo?: boolean;
}
export interface IPaqueteResponse {
    _id: string;
    nombre: string;
    destino: string;
    fecha: string;
    precio: number;
    descripcion?: string;
    activo: boolean;
}
export declare const Paquete: mongoose.Model<IPaquete, {}, {}, {}, mongoose.Document<unknown, {}, IPaquete> & IPaquete & Required<{
    _id: mongoose.Types.ObjectId;
}>, any>;
