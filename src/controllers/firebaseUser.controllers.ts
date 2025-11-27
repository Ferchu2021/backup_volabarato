import { Request, Response } from 'express';
import { firebaseAuth } from '../middlewares/firebaseAuth.js';
import { findOrCreateUserByFirebaseUid, createUserWithFirebaseUid, getUserFromRequest } from '../helpers/firebaseUserHelper.js';
import { User } from '../models/user.models.js';

/**
 * Vincular usuario de Firebase con usuario existente en MongoDB
 * POST /api/firebase/link-user
 * Requiere: Token de Firebase en header Authorization
 * Body: { email: string } - Email del usuario en MongoDB a vincular
 */
export const linkFirebaseUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Verificar que viene de Firebase Auth
    if (!req.firebaseUser) {
      res.status(401).json({
        error: 'Token Firebase requerido',
        message: 'Este endpoint requiere autenticación con Firebase'
      });
      return;
    }

    const { email } = req.body;
    const firebaseUid = req.firebaseUser.uid;
    const firebaseEmail = req.firebaseUser.email;

    if (!email && !firebaseEmail) {
      res.status(400).json({
        error: 'Email requerido',
        message: 'Proporciona el email del usuario en MongoDB o usa el email de Firebase'
      });
      return;
    }

    // Buscar usuario en MongoDB
    const userEmail = email || firebaseEmail;
    const user = await User.findOne({ email: userEmail?.toLowerCase() });

    if (!user) {
      res.status(404).json({
        error: 'Usuario no encontrado',
        message: `No se encontró un usuario con el email: ${userEmail}`
      });
      return;
    }

    // Verificar que el usuario no tenga ya un firebaseUid diferente
    if (user.firebaseUid && user.firebaseUid !== firebaseUid) {
      res.status(400).json({
        error: 'Usuario ya vinculado',
        message: `Este usuario ya está vinculado con otro UID de Firebase: ${user.firebaseUid}`
      });
      return;
    }

    // Vincular firebaseUid
    user.firebaseUid = firebaseUid;
    await user.save();

    res.json({
      message: 'Usuario vinculado exitosamente',
      user: {
        _id: user._id,
        usuario: user.usuario,
        email: user.email,
        firebaseUid: user.firebaseUid
      }
    });
  } catch (error: any) {
    console.error('[FIREBASE USER] Error vinculando usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
};

/**
 * Obtener usuario de MongoDB vinculado con Firebase
 * GET /api/firebase/user
 * Requiere: Token de Firebase en header Authorization
 */
export const getFirebaseLinkedUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Verificar que viene de Firebase Auth
    if (!req.firebaseUser) {
      res.status(401).json({
        error: 'Token Firebase requerido',
        message: 'Este endpoint requiere autenticación con Firebase'
      });
      return;
    }

    const firebaseUid = req.firebaseUser.uid;
    const firebaseEmail = req.firebaseUser.email;

    // Buscar usuario vinculado
    const user = await findOrCreateUserByFirebaseUid(firebaseUid, firebaseEmail);

    if (!user) {
      res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se encontró un usuario vinculado con este UID de Firebase. Usa /api/firebase/link-user para vincular.'
      });
      return;
    }

    res.json({
      message: 'Usuario encontrado',
      user: {
        _id: user._id,
        usuario: user.usuario,
        email: user.email,
        nombreLegal: user.nombreLegal,
        rol: user.rol,
        firebaseUid: user.firebaseUid
      }
    });
  } catch (error: any) {
    console.error('[FIREBASE USER] Error obteniendo usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
};

export default {
  linkFirebaseUser,
  getFirebaseLinkedUser
};

