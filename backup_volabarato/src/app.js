require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Importa rutas
const paqueteRoutes = require('./routes/paquete');
const userRoutes = require('./routes/user');

// Inicializa app
const app = express();

// Middlewares básicos
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(err => {
  console.error('Error de conexión:', err);
  process.exit(1); // Opcional: detiene el server si falla la db
});

// Rutas REST
app.use('/api/paquete', paqueteRoutes);
app.use('/api/user', userRoutes);

// Inicia server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend ready, puerto ${port}`));
