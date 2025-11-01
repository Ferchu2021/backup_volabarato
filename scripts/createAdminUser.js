// Script simple para crear el usuario administrador usando la API
// Ejecutar: node scripts/createAdminUser.js

const registerUser = async () => {
  try {
    console.log('🔐 Creando usuario administrador...');
    
    const response = await fetch('http://localhost:4000/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usuario: 'fernanda',
        password: '123456.a'
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Usuario creado exitosamente:');
      console.log('   Usuario: fernanda');
      console.log('   Password: 123456.a');
      console.log('\n📝 Datos del usuario:', data);
    } else {
      console.error('❌ Error del servidor:', data);
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ No se pudo conectar al servidor. Asegúrate de que el backend esté corriendo en http://localhost:4000');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
};

registerUser();

