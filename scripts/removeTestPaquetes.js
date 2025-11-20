const mongoose = require('mongoose');
require('dotenv').config();
const removeTestPaquetes = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI no estÃ¡ definida');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB');
    const Paquete = mongoose.model('Paquete', new mongoose.Schema({}, { strict: false }), 'paquetes');
    console.log('Buscando todos los paquetes...');
    const todos = await Paquete.find({});
    console.log('Total paquetes en DB:', todos.length);
    if (todos.length > 0) {
      console.log('Todos los paquetes:');
      for (let i = 0; i < todos.length; i++) {
        const p = todos[i];
        console.log((i + 1) + '. "' + (p.nombre || '(sin nombre)') + '" | Activo: ' + (p.activo || false));
      }
    }
    const paquetesPrueba = await Paquete.find({ nombre: { $regex: /prueba/i } });
    let eliminados = 0;
    if (paquetesPrueba.length > 0) {
      console.log('Encontrados ' + paquetesPrueba.length + ' paquete(s) de prueba:');
      for (const paquete of paquetesPrueba) {
        console.log('- "' + paquete.nombre + '" (ID: ' + paquete._id + ')');
      }
      const resultado = await Paquete.deleteMany({ nombre: { $regex: /prueba/i } });
      console.log('Eliminados ' + resultado.deletedCount + ' paquete(s) de prueba');
      eliminados += resultado.deletedCount;
    } else {
      console.log('No se encontraron paquetes con "prueba" en el nombre');
    }
    console.log('Resumen: Total eliminados: ' + eliminados + ' paquete(s) de prueba');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    if (mongoose.connection.readyState === 1) await mongoose.disconnect();
    process.exit(1);
  }
};
removeTestPaquetes();