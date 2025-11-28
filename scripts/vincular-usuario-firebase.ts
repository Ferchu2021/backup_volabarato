import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../src/models/user.models';

dotenv.config({ path: '.env' });

const emailUsuario = 'test@volabarato.com';
const firebaseUid = 'XumIjL07RQRRUDHVg6ycousSG1h2'; // Del token que obtuviste

async function vincularUsuario() {
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
    console.log(`🔍 Buscando usuario con email: ${emailUsuario}`);
    const usuario = await User.findOne({ email: emailUsuario.toLowerCase() });

    if (!usuario) {
      console.log(`\n❌ Usuario NO encontrado con email: ${emailUsuario}`);
      console.log('💡 Crea el usuario primero usando: POST /api/user/register\n');
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`\n✅ Usuario encontrado:`);
    console.log(`   ID: ${usuario._id}`);
    console.log(`   Usuario: ${usuario.usuario}`);
    console.log(`   Email: ${usuario.email}`);

    // Verificar si ya está vinculado
    if (usuario.firebaseUid) {
      if (usuario.firebaseUid === firebaseUid) {
        console.log(`\n✅ Usuario ya está vinculado con este Firebase UID`);
        console.log(`   Firebase UID: ${usuario.firebaseUid}\n`);
      } else {
        console.log(`\n⚠️  Usuario ya está vinculado con OTRO Firebase UID:`);
        console.log(`   Firebase UID actual: ${usuario.firebaseUid}`);
        console.log(`   Firebase UID nuevo: ${firebaseUid}`);
        console.log(`\n💡 ¿Deseas actualizar el vínculo? (S/N)`);
        // En un script interactivo, aquí pedirías confirmación
        // Por ahora, lo actualizamos directamente
        usuario.firebaseUid = firebaseUid;
        await usuario.save();
        console.log(`\n✅ Firebase UID actualizado exitosamente\n`);
      }
    } else {
      // Vincular el usuario
      console.log(`\n🔗 Vinculando usuario con Firebase UID: ${firebaseUid}`);
      usuario.firebaseUid = firebaseUid;
      await usuario.save();
      console.log(`✅ Usuario vinculado exitosamente\n`);
    }

    // Verificar el resultado
    const usuarioActualizado = await User.findById(usuario._id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Información del usuario actualizada:');
    console.log(`   ID: ${usuarioActualizado?._id}`);
    console.log(`   Usuario: ${usuarioActualizado?.usuario}`);
    console.log(`   Email: ${usuarioActualizado?.email}`);
    console.log(`   Firebase UID: ${usuarioActualizado?.firebaseUid || '❌ NO VINCULADO'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Estadísticas
    const totalUsuarios = await User.countDocuments();
    const usuariosConFirebase = await User.countDocuments({ firebaseUid: { $exists: true, $ne: null } });
    console.log(`📊 Total de usuarios en la base de datos: ${totalUsuarios}`);
    console.log(`📊 Usuarios vinculados con Firebase: ${usuariosConFirebase}`);
    console.log(`📊 Usuarios sin vincular: ${totalUsuarios - usuariosConFirebase}\n`);

    // Cerrar conexión
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
    console.log('\n✅ ¡Proceso completado exitosamente!');
    console.log('💡 Ahora puedes intentar crear la reserva con tu token de Firebase\n');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

vincularUsuario();

