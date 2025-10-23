import mongoose, { Document } from 'mongoose';
import Joi from 'joi';
export interface IUser extends Document {
    usuario: string;
    password: string;
    _id: mongoose.Types.ObjectId;
}
export interface IUserPayload {
    _id: string;
    usuario: string;
}
export declare const userJoiSchema: Joi.ObjectSchema<any>;
export interface ILoginRequest {
    usuario: string;
    password: string;
}
export interface IRegisterRequest {
    usuario: string;
    password: string;
}
export interface ILoginResponse {
    token: string;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}>, any>;
//# sourceMappingURL=user.models.d.ts.map