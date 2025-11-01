import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../src/models/user.models';

// Cargar variables de entorno
dotenv.config({ path: '.env' });

const seedAdminUser = async () => {
  try {
    console.log('🔌 Conectando a MongoDB...');
    
    // Conectar a MongoDB
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI no está definida en las variables de entorno');
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB Atlas');

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ usuario: 'fernanda' });
    
    if (existingUser) {
      console.log('⚠️  El usuario "fernanda" ya existe');
      process.exit(0);
    }

    // Crear el usuario administrador
    const adminUser = new User({
      usuario: 'fernanda',
      password: '123456.a'
    });

    // El middleware pre-save se encargará de hashear la contraseña
    await adminUser.save();

    console.log('✅ Usuario administrador creado exitosamente:');
    console.log('   Usuario: fernanda');
    console.log('   Password: 123456.a');

    // Cerrar conexión
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando usuario:', error);
    process.exit(1);
  }
};

// Ejecutar el seeding
seedAdminUser();

