import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { User, userJoiSchema, ILoginRequest, IRegisterRequest, ILoginResponse } from '../models/user.models';

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
    const { error } = userJoiSchema.validate(req.body);
    if (error) {
      const errorResponse: IErrorResponse = {
        error: 'Datos de validación incorrectos',
        details: error.details[0]?.message || 'Error de validación'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const user = new User(req.body);
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
      const errorResponse: IErrorResponse = {
        error: 'El usuario ya existe',
        message: 'Intenta con un nombre de usuario diferente'
      };
      res.status(400).json(errorResponse);
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
    const { id } = req.body;
    
    if (!id) {
      const errorResponse: IErrorResponse = {
        error: 'ID de usuario requerido en el body'
      };
      res.status(400).json(errorResponse);
      return;
    }

    const { usuario } = req.body;
    
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

    const user = await User.findByIdAndUpdate(
      id,
      req.body,
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
        rol: user.rol
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

// Controller para eliminar usuario (baja lógica)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body;
    
    if (!id) {
      const errorResponse: IErrorResponse = {
        error: 'ID de usuario requerido en el body'
      };
      res.status(400).json(errorResponse);
      return;
    }

    // En lugar de eliminar físicamente, podrías marcar como inactivo
    // await User.findByIdAndUpdate(id, { activo: false });
    
    // Por ahora, eliminamos físicamente
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

// Exportar todos los controllers
export default {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById
};
