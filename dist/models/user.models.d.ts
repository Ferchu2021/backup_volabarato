import mongoose, { Document } from 'mongoose';
import Joi from 'joi';
export interface IUser extends Document {
    usuario: string;
    password: string;
    rol: 'admin' | 'cliente';
    nombreLegal: string;
    fechaNacimiento: Date;
    nacionalidad: string;
    dni: string;
    cuilCuit?: string;
    numeroPasaporte: string;
    telefono: string;
    telefonoContacto: string;
    email: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    _id: mongoose.Types.ObjectId;
}
export interface IUserPayload {
    _id: string;
    usuario: string;
    rol?: 'admin' | 'cliente';
}
export declare const userJoiSchema: Joi.ObjectSchema<any>;
export interface ILoginRequest {
    usuario: string;
    password: string;
}
export interface IRegisterRequest {
    usuario: string;
    password: string;
    nombreLegal: string;
    fechaNacimiento: Date | string;
    nacionalidad: string;
    dni: string;
    cuilCuit?: string;
    numeroPasaporte: string;
    telefono: string;
    telefonoContacto: string;
    email: string;
}
export interface ILoginResponse {
    token: string;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=user.models.d.ts.map