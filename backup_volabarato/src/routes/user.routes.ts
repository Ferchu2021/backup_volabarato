import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User, userJoiSchema, ILoginRequest, IRegisterRequest, ILoginResponse } from '../models/user.models';

const router = Router();

// POST /api/user/register
router.post('/register', async (req: Request<{}, {}, IRegisterRequest>, res: Response): Promise<void> => {
  try {
    const { error } = userJoiSchema.validate(req.body);
    if (error) {
      res.status(400).json({ 
        error: 'Datos de validación incorrectos',
        details: error.details[0]?.message || 'Error de validación'
      });
      return;
    }

    const user = new User(req.body);
    await user.save();
    
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: {
        _id: user._id,
        usuario: user.usuario
      }
    });
  } catch (error: any) {
    console.error('Error en registro:', error);
    
    if (error.code === 11000) {
      res.status(400).json({ error: 'El usuario ya existe' });
      return;
    }
    
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/user/login
router.post('/login', async (req: Request<{}, {}, ILoginRequest>, res: Response): Promise<void> => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
      return;
    }

    const user = await User.findOne({ usuario });
    if (!user) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ error: 'Error de configuración del servidor' });
      return;
    }

    const token = jwt.sign(
      { _id: user._id, usuario: user.usuario }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const response: ILoginResponse = { token };
    res.json(response);
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
