import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../src/models/user.models';

dotenv.config({ path: '.env' });

const emailABuscar = 'test@volabarato.com';

async function verificarUsuario() {
  try {
    // Conectar a MongoDB
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGO_URI o MONGODB_URI no está configurado en las variables de entorno');
      process.exit(1);
    }

    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB\n');

    // Buscar usuario por email
    console.log(`🔍 Buscando usuario con email: ${emailABuscar}`);
    const usuario = await User.findOne({ email: emailABuscar.toLowerCase() });

    if (usuario) {
      console.log('\n✅ Usuario encontrado:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`ID: ${usuario._id}`);
      console.log(`Usuario: ${usuario.usuario}`);
      console.log(`Email: ${usuario.email}`);
      console.log(`Nombre Legal: ${usuario.nombreLegal}`);
      console.log(`Rol: ${usuario.rol}`);
      console.log(`Firebase UID: ${usuario.firebaseUid || '❌ NO VINCULADO'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      if (!usuario.firebaseUid) {
        console.log('⚠️  Este usuario NO está vinculado con Firebase');
        console.log('💡 Para vincularlo, usa el endpoint:');
        console.log('   POST /api/firebase/link-user');
        console.log('   Body: { "email": "test@volabarato.com" }');
        console.log('   Header: Authorization: Bearer <tu_token_firebase>\n');
      } else {
        console.log('✅ Usuario está vinculado con Firebase');
        console.log(`   Firebase UID: ${usuario.firebaseUid}\n`);
      }
    } else {
      console.log('\n❌ Usuario NO encontrado en MongoDB');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`No existe un usuario con el email: ${emailABuscar}\n`);
      console.log('💡 Opciones:');
      console.log('   1. Crear un nuevo usuario usando:');
      console.log('      POST /api/user/register');
      console.log('   2. O vincular el usuario de Firebase con uno existente usando:');
      console.log('      POST /api/firebase/link-user\n');
    }

    // Buscar todos los usuarios (para referencia)
    const totalUsuarios = await User.countDocuments();
    console.log(`📊 Total de usuarios en la base de datos: ${totalUsuarios}`);

    // Buscar usuarios con Firebase UID
    const usuariosConFirebase = await User.countDocuments({ firebaseUid: { $exists: true, $ne: null } });
    console.log(`📊 Usuarios vinculados con Firebase: ${usuariosConFirebase}`);
    console.log(`📊 Usuarios sin vincular: ${totalUsuarios - usuariosConFirebase}\n`);

    // Cerrar conexión
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

verificarUsuario();

