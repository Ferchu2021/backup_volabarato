import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUserPayload } from '../models/user.models.js';

// Extender la interfaz Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: IUserPayload;
    }
  }
}

// Interface para el middleware de autenticación
export interface IAuthMiddleware {
  (req: Request, res: Response, next: NextFunction): void | Response;
}

// Middleware de autenticación
export const auth: IAuthMiddleware = (req: Request, res: Response, next: NextFunction): void | Response => {
  // Log para debugging - identificar qué ruta está pidiendo token
  console.log(`[AUTH] Ruta: ${req.method} ${req.path}`);
  console.log(`[AUTH] URL completa: ${req.url}`);
  console.log(`[AUTH] Headers Authorization: ${req.header('Authorization') ? 'Presente' : 'Ausente'}`);
  
  const authHeader = req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    console.error(`[AUTH ERROR] Token requerido para: ${req.method} ${req.path}`);
    return res.status(401).json({ error: 'Acceso denegado. Token requerido.' });
  }
  
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no está configurado');
    }
    
    const verified = jwt.verify(token, process.env.JWT_SECRET) as IUserPayload;
    req.user = verified;
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(401).json({ error: 'Token inválido.' });
  }
};

export default auth;
