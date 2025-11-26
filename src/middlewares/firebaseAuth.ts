import { Request, Response, NextFunction } from 'express';
import firebaseAdmin from '../config/firebase.js';

// Extender la interfaz Request para incluir firebaseUser
declare global {
  namespace Express {
    interface Request {
      firebaseUser?: {
        uid: string;
        email?: string | undefined;
        email_verified?: boolean | undefined;
        [key: string]: any;
      };
    }
  }
}

// Interface para el middleware de autenticación Firebase
export interface IFirebaseAuthMiddleware {
  (req: Request, res: Response, next: NextFunction): Promise<void | Response>;
}

// Middleware de autenticación con Firebase
export const firebaseAuth: IFirebaseAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  // Log para debugging
  console.log(`[FIREBASE AUTH] Ruta: ${req.method} ${req.path}`);
  console.log(`[FIREBASE AUTH] URL completa: ${req.url}`);
  console.log(`[FIREBASE AUTH] Headers Authorization: ${req.header('Authorization') ? 'Presente' : 'Ausente'}`);
  
  // Verificar que Firebase Admin esté configurado
  if (!firebaseAdmin) {
    console.error('[FIREBASE AUTH ERROR] Firebase Admin no está configurado');
    return res.status(503).json({
      error: 'Servicio de autenticación no disponible',
      message: 'Firebase Admin no está configurado correctamente'
    });
  }
  
  const authHeader = req.header('Authorization');
  const idToken = authHeader?.replace('Bearer ', '');
  
  if (!idToken) {
    console.error(`[FIREBASE AUTH ERROR] Token requerido para: ${req.method} ${req.path}`);
    return res.status(401).json({
      error: 'Acceso denegado. Token Firebase requerido.',
      message: 'Incluye el token en el header: Authorization: Bearer <token>'
    });
  }
  
  try {
    // Verificar el token de Firebase
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    
    // Agregar información del usuario a la request
    req.firebaseUser = {
      ...decodedToken,
      uid: decodedToken.uid,
      email: decodedToken.email ?? undefined,
      email_verified: decodedToken.email_verified ?? undefined
    };
    
    console.log(`[FIREBASE AUTH] Usuario autenticado: ${decodedToken.email || decodedToken.uid}`);
    next();
  } catch (error: any) {
    console.error('[FIREBASE AUTH ERROR] Error verificando token:', error.message);
    
    // Errores específicos de Firebase
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        error: 'Token expirado',
        message: 'El token de Firebase ha expirado. Por favor, obtén un nuevo token.'
      });
    }
    
    if (error.code === 'auth/argument-error') {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'El formato del token es incorrecto.'
      });
    }
    
    return res.status(401).json({
      error: 'Token inválido',
      message: 'No se pudo verificar el token de Firebase.'
    });
  }
};

export default firebaseAuth;

