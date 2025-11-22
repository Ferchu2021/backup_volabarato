import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../src/models/user.models';

dotenv.config();

async function listUsers() {
  try {
    // Conectar a MongoDB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('❌ MONGO_URI no está definido en el archivo .env');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB');

    // Obtener todos los usuarios (sin password)
    const users = await User.find({}).select('usuario email rol nombreLegal');
    
    console.log('\n📋 Lista de Usuarios:\n');
    console.log('═'.repeat(80));
    
    if (users.length === 0) {
      console.log('No hay usuarios registrados en la base de datos.');
    } else {
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. Usuario: ${user.usuario}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Rol: ${user.rol}`);
        console.log(`   Nombre Legal: ${user.nombreLegal}`);
        console.log(`   ID: ${user._id}`);
        console.log('─'.repeat(80));
      });
    }
    
    console.log(`\n📊 Total: ${users.length} usuario(s)\n`);

    await mongoose.disconnect();
    console.log('✅ Desconectado de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

listUsers();

