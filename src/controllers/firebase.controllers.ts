import { Request, Response } from 'express';
import firebaseAdmin from '../config/firebase.js';

// Controller para obtener el perfil del usuario autenticado con Firebase
export const getFirebaseProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.firebaseUser) {
      res.status(401).json({
        error: 'Usuario no autenticado'
      });
      return;
    }

    // Obtener información adicional del usuario desde Firebase Admin
    if (!firebaseAdmin) {
      res.status(503).json({
        error: 'Servicio de autenticación no disponible'
      });
      return;
    }

    const userRecord = await firebaseAdmin.auth().getUser(req.firebaseUser.uid);

    res.json({
      message: 'Firebase Auth OK',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        emailVerified: userRecord.emailVerified,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        disabled: userRecord.disabled,
        metadata: {
          creationTime: userRecord.metadata.creationTime,
          lastSignInTime: userRecord.metadata.lastSignInTime
        },
        customClaims: userRecord.customClaims
      }
    });
  } catch (error: any) {
    console.error('Error obteniendo perfil de Firebase:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
};

// Controller para verificar que Firebase está configurado
export const checkFirebaseStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!firebaseAdmin) {
      res.status(503).json({
        status: 'not_configured',
        message: 'Firebase Admin no está configurado',
        error: 'Faltan variables de entorno: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY'
      });
      return;
    }

    // Intentar obtener información del proyecto
    const projectId = process.env.FIREBASE_PROJECT_ID || 'no configurado';
    
    res.json({
      status: 'configured',
      message: 'Firebase Admin está configurado correctamente',
      projectId: projectId,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error verificando estado de Firebase:', error);
    res.status(500).json({
      status: 'error',
      error: 'Error verificando Firebase',
      message: error.message
    });
  }
};

export default {
  getFirebaseProfile,
  checkFirebaseStatus
};

