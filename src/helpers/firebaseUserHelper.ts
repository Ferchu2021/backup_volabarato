import { User, IUser } from '../models/user.models.js';
import mongoose from 'mongoose';

/**
 * Busca o crea un usuario en MongoDB basado en el UID de Firebase
 * @param firebaseUid - UID del usuario en Firebase
 * @param firebaseEmail - Email del usuario en Firebase
 * @returns Usuario de MongoDB o null si no se puede crear
 */
export const findOrCreateUserByFirebaseUid = async (
  firebaseUid: string,
  firebaseEmail?: string
): Promise<IUser | null> => {
  try {
    // Buscar usuario existente por firebaseUid
    let user = await User.findOne({ firebaseUid });
    
    if (user) {
      console.log(`[FIREBASE USER HELPER] Usuario encontrado por firebaseUid: ${user.usuario}`);
      return user;
    }

    // Si no existe, buscar por email
    if (firebaseEmail) {
      user = await User.findOne({ email: firebaseEmail.toLowerCase() });
      
      if (user) {
        // Vincular el firebaseUid al usuario existente
        user.firebaseUid = firebaseUid;
        await user.save();
        console.log(`[FIREBASE USER HELPER] Usuario encontrado por email y vinculado con firebaseUid: ${user.usuario}`);
        return user;
      }
    }

    // Usuario no encontrado
    console.log(`[FIREBASE USER HELPER] Usuario no encontrado para firebaseUid: ${firebaseUid}`);
    return null;
  } catch (error: any) {
    console.error(`[FIREBASE USER HELPER] Error buscando usuario:`, error.message);
    return null;
  }
};

/**
 * Crea un nuevo usuario en MongoDB vinculado con Firebase
 * @param firebaseUid - UID del usuario en Firebase
 * @param userData - Datos del usuario para crear en MongoDB
 * @returns Usuario creado o null si hay error
 */
export const createUserWithFirebaseUid = async (
  firebaseUid: string,
  userData: {
    usuario: string;
    password: string;
    email: string;
    nombreLegal: string;
    fechaNacimiento: Date;
    nacionalidad: string;
    dni: string;
    numeroPasaporte: string;
    telefono: string;
    telefonoContacto: string;
    cuilCuit?: string;
    rol?: 'admin' | 'cliente';
  }
): Promise<IUser | null> => {
  try {
    // Verificar que el firebaseUid no esté ya en uso
    const existingUser = await User.findOne({ firebaseUid });
    if (existingUser) {
      throw new Error('El firebaseUid ya está vinculado a otro usuario');
    }

    // Crear nuevo usuario con firebaseUid
    const newUser = new User({
      ...userData,
      firebaseUid,
      rol: userData.rol || 'cliente'
    });

    await newUser.save();
    console.log(`[FIREBASE USER HELPER] Usuario creado y vinculado con firebaseUid: ${newUser.usuario}`);
    return newUser;
  } catch (error: any) {
    console.error(`[FIREBASE USER HELPER] Error creando usuario:`, error.message);
    return null;
  }
};

/**
 * Obtiene el usuario de MongoDB desde el request (puede venir de JWT o Firebase)
 * @param req - Request de Express
 * @returns Usuario de MongoDB o null
 */
export const getUserFromRequest = async (req: any): Promise<IUser | null> => {
  try {
    // Si viene de JWT
    if (req.user && req.user._id) {
      const user = await User.findById(req.user._id);
      return user;
    }

    // Si viene de Firebase
    if (req.firebaseUser && req.firebaseUser.uid) {
      const user = await findOrCreateUserByFirebaseUid(
        req.firebaseUser.uid,
        req.firebaseUser.email
      );
      return user;
    }

    return null;
  } catch (error: any) {
    console.error(`[FIREBASE USER HELPER] Error obteniendo usuario del request:`, error.message);
    return null;
  }
};

export default {
  findOrCreateUserByFirebaseUid,
  createUserWithFirebaseUid,
  getUserFromRequest
};

