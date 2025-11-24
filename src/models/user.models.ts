import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import Joi from 'joi';

// Interface para el documento User
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

// Interface para el payload del JWT
export interface IUserPayload {
  _id: string;
  usuario: string;
  rol?: 'admin' | 'cliente';
}

// Schema de Mongoose
const userSchema = new Schema<IUser>({
  usuario: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { 
    type: String, 
    enum: ['admin', 'cliente'], 
    default: 'cliente',
    required: true
  },
  nombreLegal: { type: String, required: true, trim: true },
  fechaNacimiento: { type: Date, required: true },
  nacionalidad: { type: String, required: true, trim: true },
  dni: { type: String, required: true, trim: true },
  cuilCuit: { type: String, trim: true },
  numeroPasaporte: { type: String, required: true, trim: true },
  telefono: { type: String, required: true, trim: true },
  telefonoContacto: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  resetPasswordToken: { type: String, trim: true },
  resetPasswordExpires: { type: Date }
});

// Índices
userSchema.index({ email: 1 });
userSchema.index({ dni: 1 });
userSchema.index({ numeroPasaporte: 1 });

// Middleware pre-save para hashear password
userSchema.pre<IUser>('save', function(next) {
  if (!this.isModified('password')) return next();
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

// Schema de validación Joi
export const userJoiSchema = Joi.object({
  usuario: Joi.string().min(4).max(30).required(),
  password: Joi.string().min(6).required(),
  rol: Joi.string().valid('admin', 'cliente').optional(),
  nombreLegal: Joi.string().min(2).max(100).required(),
  fechaNacimiento: Joi.date().max('now').required().messages({
    'date.max': 'La fecha de nacimiento debe ser anterior a la fecha actual'
  }),
  nacionalidad: Joi.string().min(2).max(50).required(),
  dni: Joi.string().min(7).max(10).required(),
  cuilCuit: Joi.string().min(10).max(13).optional().allow(''),
  numeroPasaporte: Joi.string().min(5).max(20).required(),
  telefono: Joi.string().min(8).max(20).required(),
  telefonoContacto: Joi.string().min(8).max(20).required(),
  email: Joi.string().email().required()
}).unknown(false); // Rechazar campos adicionales no definidos

// Interface para login
export interface ILoginRequest {
  usuario: string;
  password: string;
}

// Interface para register
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

// Interface para respuesta de login
export interface ILoginResponse {
  token: string;
}

// Modelo exportado
export const User = mongoose.model<IUser>('User', userSchema);
