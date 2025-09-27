import mongoose = require("mongoose");
export const joiSchema: Joi.ObjectSchema<any>;
import Joi = require("joi");
export declare let User: mongoose.Model<{
    usuario: string;
    password: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    usuario: string;
    password: string;
}> & {
    usuario: string;
    password: string;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    usuario: string;
    password: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    usuario: string;
    password: string;
}>> & mongoose.FlatRecord<{
    usuario: string;
    password: string;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
