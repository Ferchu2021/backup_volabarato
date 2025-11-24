import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.models.js';
import { IUserPayload } from '../models/user.models.js';

// Extender la interfaz Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: IUserPayload;
    }
  }
}

// Middleware para verificar si el usuario existe
export const checkUserExists = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const { usuario } = req.body;
    
    if (!usuario) {
      return res.status(400).json({ error: 'Usuario es requerido' });
    }

    const existingUser = await User.findOne({ usuario });
    
    if (existingUser) {
      return res.status(409).json({ 
        error: 'El usuario ya existe',
        message: 'Intenta con un nombre de usuario diferente'
      });
    }
    
    next();
  } catch (error) {
    console.error('Error verificando existencia de usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Middleware para verificar si el usuario NO existe (para login)
export const checkUserNotExists = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const { usuario } = req.body;
    
    if (!usuario) {
      return res.status(400).json({ error: 'Usuario es requerido' });
    }

    const existingUser = await User.findOne({ usuario });
    
    if (!existingUser) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado',
        message: 'Verifica que el nombre de usuario sea correcto'
      });
    }
    
    // Agregar el usuario encontrado al request para uso posterior
    req.user = {
      _id: existingUser._id.toString(),
      usuario: existingUser.usuario
    };
    
    next();
  } catch (error) {
    console.error('Error verificando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Middleware para validar formato de contraseña
export const validatePasswordFormat = (req: Request, res: Response, next: NextFunction): void | Response => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ 
      error: 'Contraseña es requerida' 
    });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ 
      error: 'La contraseña debe tener al menos 6 caracteres' 
    });
  }
  
  if (password.length > 128) {
    return res.status(400).json({ 
      error: 'La contraseña no puede exceder 128 caracteres' 
    });
  }
  
  // Verificar que no contenga espacios
  if (password.includes(' ')) {
    return res.status(400).json({ 
      error: 'La contraseña no puede contener espacios' 
    });
  }
  
  next();
};

// Middleware para validar formato de nombre de usuario
export const validateUsernameFormat = (req: Request, res: Response, next: NextFunction): void | Response => {
  const { usuario } = req.body;
  
  if (!usuario) {
    return res.status(400).json({ 
      error: 'Nombre de usuario es requerido' 
    });
  }
  
  if (usuario.length < 4) {
    return res.status(400).json({ 
      error: 'El nombre de usuario debe tener al menos 4 caracteres' 
    });
  }
  
  if (usuario.length > 30) {
    return res.status(400).json({ 
      error: 'El nombre de usuario no puede exceder 30 caracteres' 
    });
  }
  
  // Verificar que solo contenga caracteres alfanuméricos y guiones bajos
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(usuario)) {
    return res.status(400).json({ 
      error: 'El nombre de usuario solo puede contener letras, números y guiones bajos' 
    });
  }
  
  next();
};

// Middleware para verificar si el usuario está activo
export const checkUserActive = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const { usuario } = req.body;
    
    if (!usuario) {
      return res.status(400).json({ error: 'Usuario es requerido' });
    }

    const user = await User.findOne({ usuario });
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    
    // Si en el futuro agregas un campo 'activo' al modelo User, puedes verificar aquí
    // if (!user.activo) {
    //   return res.status(403).json({ 
    //     error: 'Usuario desactivado' 
    //   });
    // }
    
    next();
  } catch (error) {
    console.error('Error verificando estado del usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Middleware para rate limiting básico (opcional)
export const basicRateLimit = (() => {
  const attempts: { [key: string]: { count: number; resetTime: number } } = {};
  
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutos
    const maxAttempts = 5; // máximo 5 intentos por IP
    
    // Limpiar intentos antiguos
    if (attempts[ip] && now > attempts[ip].resetTime) {
      delete attempts[ip];
    }
    
    // Inicializar o incrementar contador
    if (!attempts[ip]) {
      attempts[ip] = { count: 1, resetTime: now + windowMs };
    } else {
      attempts[ip].count++;
    }
    
    // Verificar límite
    if (attempts[ip].count > maxAttempts) {
      return res.status(429).json({
        error: 'Demasiados intentos de acceso',
        message: `Intenta nuevamente en ${Math.ceil((attempts[ip].resetTime - now) / 60000)} minutos`
      });
    }
    
    next();
  };
})();

export default {
  checkUserExists,
  checkUserNotExists,
  validatePasswordFormat,
  validateUsernameFormat,
  checkUserActive,
  basicRateLimit
};
