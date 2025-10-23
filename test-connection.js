const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('🔄 Intentando conectar a MongoDB Atlas...');
    
    if (!process.env.MONGO_URI) {
      throw new Error('❌ MONGO_URI no está definida en .env');
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ ¡Conectado exitosamente a MongoDB Atlas!');
    
    // Probar operación básica
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📁 Colecciones disponibles:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB Atlas');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    process.exit(1);
  }
};

testConnection();