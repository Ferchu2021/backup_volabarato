import mongoose, { Document } from 'mongoose';
import Joi from 'joi';
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
export declare const destinoJoiSchema: Joi.ObjectSchema<any>;
export declare const destinoUpdateJoiSchema: Joi.ObjectSchema<any>;
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
export declare const Destino: mongoose.Model<IDestino, {}, {}, {}, mongoose.Document<unknown, {}, IDestino, {}, {}> & IDestino & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Destino.d.ts.map