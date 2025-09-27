import mongoose = require("mongoose");
export const joiSchema: Joi.ObjectSchema<any>;
import Joi = require("joi");
export declare let Paquete: mongoose.Model<{
    activo: boolean;
    nombre?: string;
    destino?: string;
    fecha?: Date;
    precio?: number;
    descripcion?: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    activo: boolean;
    nombre?: string;
    destino?: string;
    fecha?: Date;
    precio?: number;
    descripcion?: string;
}> & {
    activo: boolean;
    nombre?: string;
    destino?: string;
    fecha?: Date;
    precio?: number;
    descripcion?: string;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    activo: boolean;
    nombre?: string;
    destino?: string;
    fecha?: Date;
    precio?: number;
    descripcion?: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    activo: boolean;
    nombre?: string;
    destino?: string;
    fecha?: Date;
    precio?: number;
    descripcion?: string;
}>> & mongoose.FlatRecord<{
    activo: boolean;
    nombre?: string;
    destino?: string;
    fecha?: Date;
    precio?: number;
    descripcion?: string;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
