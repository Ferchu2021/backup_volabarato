import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../src/models/user.models';

// Cargar variables de entorno
dotenv.config({ path: '.env' });

const createUsers = async () => {
  try {
    console.log('🔌 Conectando a MongoDB...');
    
    // Conectar a MongoDB
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI no está definida en las variables de entorno');
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Verificar y crear usuario admin
    let adminUser = await User.findOne({ usuario: 'admin' });
    
    if (adminUser) {
      console.log('⚠️  El usuario "admin" ya existe');
      console.log('   ID:', adminUser._id);
      console.log('   Rol:', adminUser.rol);
    } else {
      adminUser = new User({
        usuario: 'admin',
        password: 'admin123',
        rol: 'admin',
        nombreLegal: 'Administrador',
        fechaNacimiento: new Date('1990-01-01'),
        nacionalidad: 'Argentina',
        dni: '12345678',
        numeroPasaporte: 'AD123456',
        telefono: '+54 11 1234-5678',
        telefonoContacto: '+54 11 1234-5678',
        email: 'admin@volabarato.com'
      });
      await adminUser.save();
      console.log('✅ Usuario administrador creado exitosamente:');
      console.log('   Usuario: admin');
      console.log('   Password: admin123');
    }

    // Verificar y crear usuario cliente
    let clienteUser = await User.findOne({ usuario: 'cliente' });
    
    if (clienteUser) {
      console.log('⚠️  El usuario "cliente" ya existe');
      console.log('   ID:', clienteUser._id);
      console.log('   Rol:', clienteUser.rol);
    } else {
      clienteUser = new User({
        usuario: 'cliente',
        password: 'cliente123',
        rol: 'cliente',
        nombreLegal: 'Cliente de Prueba',
        fechaNacimiento: new Date('1995-01-01'),
        nacionalidad: 'Argentina',
        dni: '87654321',
        numeroPasaporte: 'CL123456',
        telefono: '+54 11 8765-4321',
        telefonoContacto: '+54 11 8765-4321',
        email: 'cliente@volabarato.com'
      });
      await clienteUser.save();
      console.log('✅ Usuario cliente creado exitosamente:');
      console.log('   Usuario: cliente');
      console.log('   Password: cliente123');
    }

    // Cerrar conexión
    await mongoose.connection.close();
    console.log('\n🔌 Conexión cerrada');
    
    console.log('\n📋 RESUMEN DE USUARIOS:');
    console.log('═'.repeat(60));
    console.log('👤 ADMINISTRADOR:');
    console.log('   Usuario: admin');
    console.log('   Password: admin123');
    console.log('   Email: admin@volabarato.com');
    console.log('\n👤 CLIENTE:');
    console.log('   Usuario: cliente');
    console.log('   Password: cliente123');
    console.log('   Email: cliente@volabarato.com');
    console.log('═'.repeat(60));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando usuarios:', error);
    process.exit(1);
  }
};

// Ejecutar el script
createUsers();

