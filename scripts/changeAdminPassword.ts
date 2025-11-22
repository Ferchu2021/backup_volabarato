import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../src/models/user.models';

// Cargar variables de entorno
dotenv.config({ path: '.env' });

const changeAdminPassword = async () => {
  try {
    // Obtener la nueva contraseña desde los argumentos de línea de comandos
    const newPassword = process.argv[2];
    
    if (!newPassword || newPassword.trim().length === 0) {
      console.log('❌ Error: Debes proporcionar una nueva contraseña');
      console.log('\n📖 Uso:');
      console.log('   npm run change:admin:password -- "nueva_contraseña"');
      console.log('\n   O directamente:');
      console.log('   ts-node scripts/changeAdminPassword.ts "nueva_contraseña"');
      process.exit(1);
    }

    if (newPassword.length < 6) {
      console.log('❌ Error: La contraseña debe tener al menos 6 caracteres');
      process.exit(1);
    }

    console.log('🔌 Conectando a MongoDB...');
    
    // Conectar a MongoDB
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI no está definida en las variables de entorno');
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Buscar usuario admin
    const adminUser = await User.findOne({ usuario: 'admin' });
    
    if (!adminUser) {
      console.log('❌ El usuario "admin" no existe en la base de datos');
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log('👤 Usuario encontrado:');
    console.log(`   Usuario: ${adminUser.usuario}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Rol: ${adminUser.rol}\n`);

    // Actualizar la contraseña usando updateOne para evitar validación de otros campos
    // Primero hashear la contraseña manualmente
    const bcrypt = require('bcrypt');
    const hashedPassword = bcrypt.hashSync(newPassword.trim(), 10);
    
    await User.updateOne(
      { usuario: 'admin' },
      { $set: { password: hashedPassword } }
    );

    console.log('✅ Contraseña del admin actualizada exitosamente');
    console.log('\n📋 RESUMEN:');
    console.log('═'.repeat(60));
    console.log('👤 ADMINISTRADOR:');
    console.log(`   Usuario: ${adminUser.usuario}`);
    console.log(`   Nueva contraseña: ${newPassword.trim()}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log('═'.repeat(60));

    // Cerrar conexión
    await mongoose.connection.close();
    console.log('\n🔌 Conexión cerrada');
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error cambiando contraseña del admin:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Ejecutar el script
changeAdminPassword();

