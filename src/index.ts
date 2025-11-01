import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

// Importa rutas
import paqueteRoutes from './routes/paquete';
import userRoutes from './routes/user.routes';
import productoRoutes from './routes/producto.routes';
import destinoRoutes from './routes/destino.routes';
import reservaRoutes from './routes/reserva.routes';

// Carga variables de entorno
dotenv.config();

// Inicializa app
const app: Application = express();

// Middlewares básicos
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Conexión a MongoDB Atlas
const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI no está definida en las variables de entorno');
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error);
    process.exit(1);
  }
};

// Rutas REST
app.use('/api/paquete', paqueteRoutes);
app.use('/api/user', userRoutes);
app.use('/api/producto', productoRoutes);
app.use('/api/destino', destinoRoutes);
app.use('/api/reserva', reservaRoutes);

// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: '🚀 Backend VolaBarato API',
    version: '1.0.0',
    status: 'running'
  });
});

// Middleware catch-all para rutas no definidas
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.path}`,
    availableEndpoints: {
      paquete: '/api/paquete',
      user: '/api/user',
      producto: '/api/producto',
      destino: '/api/destino',
      reserva: '/api/reserva'
    }
  });
});

// Inicia server
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    
    const port: number = parseInt(process.env.PORT || '4000', 10);
    
    app.listen(port, () => {
      console.log(`🚀 Backend ready en puerto ${port}`);
      console.log(`📡 API disponible en: http://localhost:${port}/api`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Ejecuta el servidor
startServer();

export default app;
