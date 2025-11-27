import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.models.js';
import { getUserFromRequest } from '../helpers/firebaseUserHelper.js';

/**
 * Middleware para verificar que el usuario es administrador
 * Funciona con JWT o Firebase Auth
 */
export const adminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    // Obtener usuario de MongoDB (desde JWT o Firebase)
    const user = await getUserFromRequest(req);

    if (!user) {
      return res.status(401).json({
        error: 'Acceso denegado',
        message: 'Usuario no encontrado. Autenticación requerida.'
      });
    }

    // Verificar que el usuario sea admin
    if (user.rol !== 'admin') {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: 'Esta operación requiere permisos de administrador.'
      });
    }

    // Agregar usuario a la request para uso posterior
    (req as any).mongoUser = user;
    
    console.log(`[ADMIN AUTH] Usuario admin autenticado: ${user.usuario}`);
    next();
  } catch (error: any) {
    console.error('[ADMIN AUTH] Error:', error.message);
    return res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo verificar los permisos de administrador.'
    });
  }
};

export default adminAuth;

