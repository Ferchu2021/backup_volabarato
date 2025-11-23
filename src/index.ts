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
import suscriptorRoutes from './routes/suscriptor.routes';
import pagoRoutes from './routes/pago.routes';

// Carga variables de entorno
dotenv.config();

// Inicializa app
const app: Application = express();

// Middlewares bÃ¡sicos
app.use(helmet({
  contentSecurityPolicy: false, // Permite cargar recursos desde cualquier origen
  crossOriginEmbedderPolicy: false
}));
// Configuración de CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : process.env.NODE_ENV === 'production' 
      ? false // En producción, debe especificarse CORS_ORIGIN
      : '*', // En desarrollo, permite todas las solicitudes
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: process.env.NODE_ENV === 'production'
};
app.use(cors(corsOptions));
// Morgan solo en desarrollo, en producción usar formato combinado
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ConexiÃ³n a MongoDB Atlas
const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI no estÃ¡ definida en las variables de entorno');
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('âœ… Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('âŒ Error de conexiÃ³n a MongoDB:', error);
    process.exit(1);
  }
};

// Rutas REST
app.use('/api/paquete', paqueteRoutes);
app.use('/api/user', userRoutes);
app.use('/api/producto', productoRoutes);
app.use('/api/destino', destinoRoutes);
app.use('/api/reserva', reservaRoutes);
app.use('/api/suscriptor', suscriptorRoutes);
app.use('/api/pago', pagoRoutes);

// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.json({
    message: 'Backend VolaBarato API',
    version: '1.0.0',
    status: 'running'
  });
});

// Ruta de información de la API
app.get('/api', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.json({
    message: 'VolaBarato API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      paquete: '/api/paquete',
      user: '/api/user',
      producto: '/api/producto',
      destino: '/api/destino',
      reserva: '/api/reserva',
      suscriptor: '/api/suscriptor',
      pago: '/api/pago'
    }
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
      reserva: '/api/reserva',
      suscriptor: '/api/suscriptor',
      pago: '/api/pago'
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
      if (process.env.NODE_ENV !== 'production') {
        console.log(`📡 API disponible en: http://localhost:${port}/api`);
      } else {
        console.log(`📡 API disponible en puerto ${port}`);
      }
    });
  } catch (error) {
    console.error('âŒ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Ejecuta el servidor
startServer();

export default app;





