import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI no está definida en las variables de entorno');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

// Eliminar índice duplicado de numeroReserva
const eliminarIndiceDuplicado = async (): Promise<void> => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('No hay conexión a la base de datos');
    }

    const collection = db.collection('reservas');
    
    // Listar todos los índices
    const indices = await collection.indexes();
    console.log('\n📋 Índices actuales en la colección "reservas":');
    indices.forEach((index: any, i: number) => {
      console.log(`${i + 1}. ${JSON.stringify(index.key)} - Nombre: ${index.name}`);
    });

    // Buscar índices duplicados de numeroReserva
    const indicesNumeroReserva = indices.filter((index: any) => 
      index.key && index.key.numeroReserva !== undefined
    );

    if (indicesNumeroReserva.length > 1) {
      console.log(`\n⚠️ Se encontraron ${indicesNumeroReserva.length} índices para numeroReserva`);
      
      // Eliminar índices duplicados (mantener solo el primero)
      const primerIndice = indicesNumeroReserva[0];
      if (!primerIndice || !primerIndice.name) {
        throw new Error('No se pudo identificar el primer índice');
      }
      
      for (let i = 1; i < indicesNumeroReserva.length; i++) {
        const indiceActual = indicesNumeroReserva[i];
        if (!indiceActual || !indiceActual.name) continue;
        
        const indexName = indiceActual.name;
        if (indexName && indexName !== primerIndice.name) {
          try {
            await collection.dropIndex(indexName);
            console.log(`✅ Índice eliminado: ${indexName}`);
          } catch (error: any) {
            if (error.codeName === 'IndexNotFound') {
              console.log(`ℹ️ Índice ${indexName} ya no existe`);
            } else {
              console.error(`❌ Error al eliminar índice ${indexName}:`, error.message);
            }
          }
        }
      }
    } else if (indicesNumeroReserva.length === 1) {
      console.log('\n✅ Solo hay un índice para numeroReserva (correcto)');
    } else {
      console.log('\n⚠️ No se encontraron índices para numeroReserva');
    }

    // Listar índices después de la limpieza
    const indicesFinales = await collection.indexes();
    console.log('\n📋 Índices finales:');
    indicesFinales.forEach((index: any, i: number) => {
      console.log(`${i + 1}. ${JSON.stringify(index.key)} - Nombre: ${index.name}`);
    });

  } catch (error) {
    console.error('❌ Error al eliminar índice duplicado:', error);
    throw error;
  }
};

// Ejecutar
const main = async () => {
  try {
    await connectDB();
    await eliminarIndiceDuplicado();
    console.log('\n✅ Proceso completado');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

main();

