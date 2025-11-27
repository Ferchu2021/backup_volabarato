import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUserPayload } from '../models/user.models.js';
import firebaseAdmin from '../config/firebase.js';

/**
 * Middleware dual que permite autenticación con JWT o Firebase
 * Intenta primero con JWT, si falla intenta con Firebase
 * Si ambos fallan, retorna error 401
 */
export const dualAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  console.log(`[DUAL AUTH] Ruta: ${req.method} ${req.path}`);
  
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({
      error: 'Acceso denegado. Token requerido.',
      message: 'Incluye un token JWT o Firebase en el header: Authorization: Bearer <token>'
    });
  }

  const token = authHeader.replace('Bearer ', '');

  // Intentar primero con JWT
  if (process.env.JWT_SECRET) {
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET) as IUserPayload;
      req.user = verified;
      console.log(`[DUAL AUTH] ✅ Autenticado con JWT: ${verified.usuario}`);
      return next();
    } catch (jwtError: any) {
      // JWT falló, continuar con Firebase
      console.log(`[DUAL AUTH] JWT falló, intentando con Firebase...`);
    }
  }

  // Intentar con Firebase
  if (!firebaseAdmin) {
    return res.status(401).json({
      error: 'Acceso denegado. Token inválido.',
      message: 'Firebase Admin no está configurado y el token JWT no es válido.'
    });
  }

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    
    req.firebaseUser = {
      ...decodedToken,
      uid: decodedToken.uid,
      email: decodedToken.email ?? undefined,
      email_verified: decodedToken.email_verified ?? undefined
    };
    
    console.log(`[DUAL AUTH] ✅ Autenticado con Firebase: ${decodedToken.email || decodedToken.uid}`);
    return next();
  } catch (firebaseError: any) {
    console.error(`[DUAL AUTH] ❌ Firebase falló:`, firebaseError.message);
    return res.status(401).json({
      error: 'Acceso denegado. Token inválido.',
      message: 'El token JWT o Firebase proporcionado no es válido.'
    });
  }
};

export default dualAuth;
