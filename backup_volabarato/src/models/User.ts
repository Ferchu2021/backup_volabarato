import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import Joi from 'joi';

// Interface para el documento User
export interface IUser extends Document {
  usuario: string;
  password: string;
  _id: mongoose.Types.ObjectId;
}

// Interface para el payload del JWT
export interface IUserPayload {
  _id: string;
  usuario: string;
}

// Schema de Mongoose
const userSchema = new Schema<IUser>({
  usuario: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Middleware pre-save para hashear password
userSchema.pre<IUser>('save', function(next) {
  if (!this.isModified('password')) return next();
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

// Schema de validación Joi
export const userJoiSchema = Joi.object({
  usuario: Joi.string().min(4).max(30).required(),
  password: Joi.string().min(6).required()
});

// Interface para login
export interface ILoginRequest {
  usuario: string;
  password: string;
}

// Interface para register
export interface IRegisterRequest {
  usuario: string;
  password: string;
}

// Interface para respuesta de login
export interface ILoginResponse {
  token: string;
}

// Modelo exportado
export const User = mongoose.model<IUser>('User', userSchema);
