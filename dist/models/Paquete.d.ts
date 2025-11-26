import mongoose, { Document } from 'mongoose';
import Joi from 'joi';
export interface IPaquete extends Document {
    nombre: string;
    destino: string;
    fecha: Date;
    precio: number;
    descripcion: string;
    activo: boolean;
    moneda?: string;
    destacado?: boolean;
    categoria?: string;
    duracion?: string;
    incluye?: string[];
    imagenes?: string[];
    _id: mongoose.Types.ObjectId;
}
export declare const paqueteJoiSchema: Joi.ObjectSchema<any>;
export declare const paqueteUpdateJoiSchema: Joi.ObjectSchema<any>;
export interface ICreatePaqueteRequest {
    nombre: string;
    destino: string;
    fecha: Date;
    precio: number;
    descripcion?: string;
    activo?: boolean;
    moneda?: string;
    destacado?: boolean;
    categoria?: string;
    duracion?: string;
    incluye?: string[];
    imagenes?: string[];
}
export interface IUpdatePaqueteRequest {
    nombre?: string;
    destino?: string;
    fecha?: Date;
    precio?: number;
    descripcion?: string;
    activo?: boolean;
    moneda?: string;
    destacado?: boolean;
    categoria?: string;
    duracion?: string;
    incluye?: string[];
    imagenes?: string[];
}
export interface IPaqueteResponse {
    _id: string;
    nombre: string;
    destino: string;
    fecha: string;
    precio: number;
    descripcion?: string;
    activo: boolean;
    moneda?: string;
    destacado?: boolean;
    categoria?: string;
    duracion?: string;
    incluye?: string[];
    imagenes?: string[];
}
export declare const Paquete: mongoose.Model<IPaquete, {}, {}, {}, mongoose.Document<unknown, {}, IPaquete, {}, {}> & IPaquete & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Paquete.d.ts.map