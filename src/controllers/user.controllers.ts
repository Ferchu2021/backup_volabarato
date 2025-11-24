import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { User, userJoiSchema, ILoginRequest, IRegisterRequest, ILoginResponse } from '../models/user.models';
import { enviarEmailRecuperacionPassword } from '../services/email.service';

// Interface para respuesta de registro
export interface IRegisterResponse {
  message: string;
  user: {
    _id: string;
    usuario: string;
  };
}

// Interface para respuesta de error
export interface IErrorResponse {
  error: string;
  details?: string;
  message?: string;
}

// Controller para registrar un nuevo usuario
export const registerUser = async (req: Request<{}, {}, IRegisterRequest>, res: Response): Promise<void> => {
  try {
    // Validar con opciones que permitan ver todos los errores
    const { error, value } = userJoiSchema.validate(req.body, {
      abortEarly: false, // Mostrar todos los errores, no solo el primero
      stripUnknown: false // No eliminar campos desconocidos, para ver qué está causando el error
    });
    
    if (error) {
      console.error('Error de validación Joi:', error.details);
      const errorResponse: IErrorResponse = {
        error: 'Datos de validación incorrectos',
        details: error.details.map(d => d.message).join('; ') || 'Error de validación'
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Convertir fechaNacimiento a Date si viene como string
    const userData = {
      ...req.body,
      fechaNacimiento: req.body.fechaNacimiento instanceof Date 
        ? req.body.fechaNacimiento 
        : new Date(req.body.fechaNacimiento)
    };
    
    const user = new User(userData);
    await user.save();
    
    const response: IRegisterResponse = {
      message: 'Usuario creado exitosamente',
      user: {
        _id: user._id.toString(),
        usuario: user.usuario
      }
    };
    
    res.status(201).json(response);
  } catch (error: any) {
    console.error('Error en registro:', error);
    
    if (error.code === 11000) {
      // Determinar qué campo duplicado causó el error
      const keyPattern = error.keyPattern || {};
      let duplicateField = 'usuario';
      let errorMessage = 'El usuario ya existe';
      let suggestion = 'Intenta con un nombre de usuario diferente';
      
      if (keyPattern.email) {
        duplicateField = 'email';
        errorMessage = 'El email ya está registrado';
        suggestion = 'Intenta con un email diferente o inicia sesión si ya tienes una cuenta';
      } else if (keyPattern.dni) {
        duplicateField = 'dni';
        errorMessage = 'El DNI ya está registrado';
        suggestion = 'Este DNI ya está asociado a otra cuenta';
      } else if (keyPattern.numeroPasaporte) {
        duplicateField = 'numeroPasaporte';
        errorMessage = 'El número de pasaporte ya está registrado';
        suggestion = 'Este número de pasaporte ya está asociado a otra cuenta';
      } else if (keyPattern.usuario) {
        duplicateField = 'usuario';
        errorMessage = 'El usuario ya existe';
        suggestion = 'Intenta con un nombre de usuario diferente o inicia sesión si ya tienes una cuenta';
      }
      
      const errorResponse: IErrorResponse = {
        error: errorMessage,
        message: suggestion
      };
      res.status(409).json(errorResponse);
      return;
    }
    
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para iniciar sesión
export const loginUser = async (req: Request<{}, {}, ILoginRequest>, res: Response): Promise<void> => {
  try {
    // Limpiar espacios en blanco de los campos recibidos
    const usuario = req.body.usuario?.trim();
    const password = req.body.password?.trim();

    if (!usuario || !password) {
      const errorResponse: IErrorResponse = {
        error: 'Usuario y contraseña son requeridos'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const user = await User.findOne({ usuario });
    if (!user) {
      const errorResponse: IErrorResponse = {
        error: 'Credenciales inválidas',
        message: 'Verifica que el nombre de usuario sea correcto'
      };
      res.status(401).json(errorResponse);
      return;
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      const errorResponse: IErrorResponse = {
        error: 'Credenciales inválidas',
        message: 'Verifica que la contraseña sea correcta'
      };
      res.status(401).json(errorResponse);
      return;
    }

    if (!process.env.JWT_SECRET) {
      const errorResponse: IErrorResponse = {
        error: 'Error de configuración del servidor'
      };
      res.status(500).json(errorResponse);
      return;
    }

    const token = jwt.sign(
      { _id: user._id, usuario: user.usuario, rol: user.rol }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const response: ILoginResponse = { token };
    res.json(response);
  } catch (error) {
    console.error('Error en login:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para obtener información del usuario actual
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;
    
    if (!id) {
      const errorResponse: IErrorResponse = {
        error: 'ID de usuario requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      const errorResponse: IErrorResponse = {
        error: 'Usuario no encontrado'
      };
      res.status(404).json(errorResponse);
      return;
    }

    res.json({
      _id: user._id,
      usuario: user.usuario,
      rol: user.rol
    });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para actualizar información del usuario
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Puede venir desde req.params (PUT /:id) o req.body (PUT /me)
    const id = req.params.id || req.body.id;
    
    if (!id) {
      const errorResponse: IErrorResponse = {
        error: 'ID de usuario requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const { usuario, password, rol } = req.body;
    
    // Validar que el nuevo usuario no esté en uso por otro usuario
    if (usuario) {
      const existingUser = await User.findOne({ 
        usuario, 
        _id: { $ne: id } 
      });
      
      if (existingUser) {
        const errorResponse: IErrorResponse = {
          error: 'El nombre de usuario ya está en uso'
        };
        res.status(400).json(errorResponse);
        return;
      }
    }

    // Construir objeto de actualización
    const updateData: any = {};
    if (usuario) updateData.usuario = usuario;
    if (password) updateData.password = password;
    if (rol) updateData.rol = rol;

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      const errorResponse: IErrorResponse = {
        error: 'Usuario no encontrado'
      };
      res.status(404).json(errorResponse);
      return;
    }

    res.json({
      message: 'Usuario actualizado exitosamente',
      user: {
        _id: user._id,
        usuario: user.usuario,
        rol: user.rol,
        nombreLegal: user.nombreLegal,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para cambiar contraseña
export const changePassword = async (req: Request<{}, {}, { id?: string; currentPassword: string; newPassword: string }>, res: Response): Promise<void> => {
  try {
    const { id, currentPassword, newPassword } = req.body;

    if (!id) {
      const errorResponse: IErrorResponse = {
        error: 'ID de usuario requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    if (!currentPassword || !newPassword) {
      const errorResponse: IErrorResponse = {
        error: 'La contraseña actual y la nueva contraseña son requeridas'
      };
      res.status(400).json(errorResponse);
      return;
    }

    if (newPassword.length < 6) {
      const errorResponse: IErrorResponse = {
        error: 'La nueva contraseña debe tener al menos 6 caracteres'
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Buscar el usuario con la contraseña para poder verificarla
    const user = await User.findById(id);
    if (!user) {
      const errorResponse: IErrorResponse = {
        error: 'Usuario no encontrado'
      };
      res.status(404).json(errorResponse);
      return;
    }

    // Verificar la contraseña actual
    const validPassword = bcrypt.compareSync(currentPassword, user.password);
    if (!validPassword) {
      const errorResponse: IErrorResponse = {
        error: 'La contraseña actual es incorrecta'
      };
      res.status(401).json(errorResponse);
      return;
    }

    // Actualizar la contraseña (el middleware pre-save la hasheará)
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error: any) {
    console.error('Error cambiando contraseña:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para eliminar usuario (baja lógica)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Puede venir desde req.params (DELETE /:id) o req.body (DELETE /me)
    const id = req.params.id || req.body.id;
    
    if (!id) {
      const errorResponse: IErrorResponse = {
        error: 'ID de usuario requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Verificar que el usuario existe
    const user = await User.findById(id);
    if (!user) {
      const errorResponse: IErrorResponse = {
        error: 'Usuario no encontrado'
      };
      res.status(404).json(errorResponse);
      return;
    }

    // Eliminar físicamente
    await User.findByIdAndDelete(id);

    res.json({
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para obtener todos los usuarios
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({}).select('-password');
    
    res.json(users);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para obtener un usuario por ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Verificar que el usuario existe
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      const errorResponse: IErrorResponse = {
        error: 'ID de usuario inválido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const user = await User.findById(id).select('-password');
    
    if (!user) {
      const errorResponse: IErrorResponse = {
        error: 'Usuario no encontrado'
      };
      res.status(404).json(errorResponse);
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para solicitar recuperación de contraseña
export const requestPasswordReset = async (req: Request<{}, {}, { email: string }>, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      const errorResponse: IErrorResponse = {
        error: 'El email es requerido'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    // Por seguridad, siempre devolver éxito aunque el email no exista
    if (!user) {
      res.json({
        message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña'
      });
      return;
    }

    // Generar token de reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Guardar token hasheado y fecha de expiración (1 hora)
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora
    await user.save();

    // Enviar email con el token sin hashear
    try {
      await enviarEmailRecuperacionPassword(
        user.email,
        user.nombreLegal || user.usuario,
        resetToken
      );
    } catch (emailError) {
      console.error('Error enviando email:', emailError);
      // Limpiar el token si falla el email
      user.resetPasswordToken = null as any;
      user.resetPasswordExpires = null as any;
      await user.save();
      
      const errorResponse: IErrorResponse = {
        error: 'Error al enviar el email. Por favor intenta más tarde.'
      };
      res.status(500).json(errorResponse);
      return;
    }

    res.json({
      message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña'
    });
  } catch (error: any) {
    console.error('Error solicitando reset de contraseña:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Controller para resetear contraseña con token
export const resetPassword = async (req: Request<{}, {}, { token: string; newPassword: string }>, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      const errorResponse: IErrorResponse = {
        error: 'El token y la nueva contraseña son requeridos'
      };
      res.status(400).json(errorResponse);
      return;
    }

    if (newPassword.length < 6) {
      const errorResponse: IErrorResponse = {
        error: 'La contraseña debe tener al menos 6 caracteres'
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Hashear el token para comparar
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Buscar usuario con token válido y no expirado
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      const errorResponse: IErrorResponse = {
        error: 'El token es inválido o ha expirado'
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Actualizar contraseña y limpiar token
    user.password = newPassword;
    user.resetPasswordToken = null as any;
    user.resetPasswordExpires = null as any;
    await user.save();

    res.json({
      message: 'Contraseña restablecida exitosamente'
    });
  } catch (error: any) {
    console.error('Error reseteando contraseña:', error);
    const errorResponse: IErrorResponse = {
      error: 'Error interno del servidor'
    };
    res.status(500).json(errorResponse);
  }
};

// Exportar todos los controllers
export default {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  requestPasswordReset,
  resetPassword
};
