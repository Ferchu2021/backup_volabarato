import mongoose, { Document } from 'mongoose';
import Joi from 'joi';
export interface IReserva extends Document {
    usuario: mongoose.Types.ObjectId;
    paquete: mongoose.Types.ObjectId;
    fechaReserva: Date;
    fechaViaje: Date;
    cantidadPersonas: number;
    precioTotal: number;
    estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
    metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
    observaciones?: string;
    datosContacto: {
        nombre: string;
        email: string;
        telefono: string;
    };
    fechaCreacion: Date;
    fechaActualizacion: Date;
    _id: mongoose.Types.ObjectId;
}
export declare const reservaJoiSchema: Joi.ObjectSchema<any>;
export interface ICreateReservaRequest {
    usuario: string;
    paquete: string;
    fechaViaje: Date;
    cantidadPersonas: number;
    precioTotal: number;
    estado?: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
    metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
    observaciones?: string;
    datosContacto: {
        nombre: string;
        email: string;
        telefono: string;
    };
}
export interface IUpdateReservaRequest {
    fechaViaje?: Date;
    cantidadPersonas?: number;
    precioTotal?: number;
    estado?: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
    metodoPago?: 'efectivo' | 'tarjeta' | 'transferencia';
    observaciones?: string;
    datosContacto?: {
        nombre?: string;
        email?: string;
        telefono?: string;
    };
}
export interface IReservaResponse {
    _id: string;
    usuario: string;
    paquete: string;
    fechaReserva: string;
    fechaViaje: string;
    cantidadPersonas: number;
    precioTotal: number;
    estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
    metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
    observaciones?: string;
    datosContacto: {
        nombre: string;
        email: string;
        telefono: string;
    };
    fechaCreacion: string;
    fechaActualizacion: string;
}
export interface IReservaPopulatedResponse {
    _id: string;
    usuario: {
        _id: string;
        nombre: string;
        email: string;
    };
    paquete: {
        _id: string;
        nombre: string;
        destino: string;
        precio: number;
    };
    fechaReserva: string;
    fechaViaje: string;
    cantidadPersonas: number;
    precioTotal: number;
    estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
    metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
    observaciones?: string;
    datosContacto: {
        nombre: string;
        email: string;
        telefono: string;
    };
    fechaCreacion: string;
    fechaActualizacion: string;
}
export declare const Reserva: mongoose.Model<IReserva, {}, {}, {}, mongoose.Document<unknown, {}, IReserva> & IReserva & Required<{
    _id: mongoose.Types.ObjectId;
}>, any>;
//# sourceMappingURL=Reserva.d.ts.map