import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Paquete, IPaquete } from '../src/models/Paquete';

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
    console.error('❌ Error de conexión a MongoDB:', error);
    process.exit(1);
  }
};

// Función para actualizar categorías de paquetes
const updatePackageCategories = async (): Promise<void> => {
  try {
    await connectDB();
    
    console.log('🔄 Actualizando categorías de paquetes...\n');
    
    // 1. Actualizar PKG004 - Cataratas del Iguazú a Argentina
    const result1 = await Paquete.updateMany(
      { nombre: { $regex: /PKG004.*Cataratas/i } },
      { $set: { categoria: 'Argentina' } }
    );
    console.log(`✅ PKG004 - Cataratas del Iguazú: ${result1.modifiedCount} paquete(s) actualizado(s) a "Argentina"`);
    
    // 2. Actualizar PKG005 - Bariloche a Argentina
    const result2 = await Paquete.updateMany(
      { nombre: { $regex: /PKG005.*Bariloche/i } },
      { $set: { categoria: 'Argentina' } }
    );
    console.log(`✅ PKG005 - Bariloche: ${result2.modifiedCount} paquete(s) actualizado(s) a "Argentina"`);
    
    // 3. Actualizar PKG001 - Orlando + Miami a Estados Unidos
    const result3 = await Paquete.updateMany(
      { nombre: { $regex: /PKG001.*Orlando.*Miami/i } },
      { $set: { categoria: 'Estados Unidos' } }
    );
    console.log(`✅ PKG001 - Orlando + Miami: ${result3.modifiedCount} paquete(s) actualizado(s) a "Estados Unidos"`);
    
    // 4. Actualizar PKG009 - Punta Cana a Caribe
    const result4 = await Paquete.updateMany(
      { nombre: { $regex: /PKG009.*Punta Cana/i } },
      { $set: { categoria: 'Caribe' } }
    );
    console.log(`✅ PKG009 - Punta Cana: ${result4.modifiedCount} paquete(s) actualizado(s) a "Caribe"`);
    
    // 5. Actualizar PKG008 - Cancún a Caribe
    const result5 = await Paquete.updateMany(
      { nombre: { $regex: /PKG008.*Cancún|PKG008.*Cancun/i } },
      { $set: { categoria: 'Caribe' } }
    );
    console.log(`✅ PKG008 - Cancún: ${result5.modifiedCount} paquete(s) actualizado(s) a "Caribe"`);
    
    // 6. Actualizar PKG007 - Playa del Carmen a Caribe
    const result6 = await Paquete.updateMany(
      { nombre: { $regex: /PKG007.*Playa del Carmen/i } },
      { $set: { categoria: 'Caribe' } }
    );
    console.log(`✅ PKG007 - Playa del Carmen: ${result6.modifiedCount} paquete(s) actualizado(s) a "Caribe"`);
    
    // 7. Actualizar todos los paquetes con categoría "Playa" o "Playas" a "Caribe"
    const result7 = await Paquete.updateMany(
      { categoria: { $in: ['Playa', 'Playas', 'playa', 'playas'] } },
      { $set: { categoria: 'Caribe' } }
    );
    console.log(`✅ Categoría "Playa/Playas": ${result7.modifiedCount} paquete(s) actualizado(s) a "Caribe"`);
    
    // 8. Actualizar paquetes de Cancún, Punta Cana, Playa del Carmen que no tengan categoría correcta
    const result8 = await Paquete.updateMany(
      {
        $or: [
          { destino: { $regex: /cancún|cancun/i } },
          { destino: { $regex: /punta cana/i } },
          { destino: { $regex: /playa del carmen/i } },
          { nombre: { $regex: /cancún|cancun/i } },
          { nombre: { $regex: /punta cana/i } },
          { nombre: { $regex: /playa del carmen/i } }
        ],
        categoria: { $ne: 'Caribe' }
      },
      { $set: { categoria: 'Caribe' } }
    );
    console.log(`✅ Destinos Caribe (Cancún, Punta Cana, Playa del Carmen): ${result8.modifiedCount} paquete(s) actualizado(s) a "Caribe"`);
    
    // 9. Actualizar paquetes de Cataratas del Iguazú que no tengan categoría Argentina
    const result9 = await Paquete.updateMany(
      {
        $or: [
          { destino: { $regex: /cataratas|iguazú|iguazu/i } },
          { nombre: { $regex: /cataratas|iguazú|iguazu/i } }
        ],
        categoria: { $ne: 'Argentina' }
      },
      { $set: { categoria: 'Argentina' } }
    );
    console.log(`✅ Cataratas del Iguazú: ${result9.modifiedCount} paquete(s) actualizado(s) a "Argentina"`);
    
    // 10. Actualizar paquetes de Bariloche que no tengan categoría Argentina
    const result10 = await Paquete.updateMany(
      {
        $or: [
          { destino: { $regex: /bariloche/i } },
          { nombre: { $regex: /bariloche/i } }
        ],
        categoria: { $ne: 'Argentina' }
      },
      { $set: { categoria: 'Argentina' } }
    );
    console.log(`✅ Bariloche: ${result10.modifiedCount} paquete(s) actualizado(s) a "Argentina"`);
    
    // 11. Actualizar paquetes de Orlando + Miami que no tengan categoría Estados Unidos
    const result11 = await Paquete.updateMany(
      {
        $or: [
          { destino: { $regex: /orlando.*miami|miami.*orlando/i } },
          { nombre: { $regex: /orlando.*miami|miami.*orlando/i } }
        ],
        categoria: { $ne: 'Estados Unidos' }
      },
      { $set: { categoria: 'Estados Unidos' } }
    );
    console.log(`✅ Orlando + Miami: ${result11.modifiedCount} paquete(s) actualizado(s) a "Estados Unidos"`);
    
    // 12. Actualizar PKG025 - Italia - Venecia a Europa
    const result12 = await Paquete.updateMany(
      { nombre: { $regex: /PKG025.*Italia.*Venecia/i } },
      { $set: { categoria: 'Europa' } }
    );
    console.log(`✅ PKG025 - Italia - Venecia: ${result12.modifiedCount} paquete(s) actualizado(s) a "Europa"`);
    
    // 13. Actualizar PKG024 - Italia - Puglia a Europa
    const result13 = await Paquete.updateMany(
      { nombre: { $regex: /PKG024.*Italia.*Puglia/i } },
      { $set: { categoria: 'Europa' } }
    );
    console.log(`✅ PKG024 - Italia - Puglia: ${result13.modifiedCount} paquete(s) actualizado(s) a "Europa"`);
    
    // 14. Actualizar paquetes de Italia que no tengan categoría Europa
    const result14 = await Paquete.updateMany(
      {
        $or: [
          { destino: { $regex: /italia|italy/i } },
          { nombre: { $regex: /italia|italy|venecia|venice|puglia/i } }
        ],
        categoria: { $ne: 'Europa' }
      },
      { $set: { categoria: 'Europa' } }
    );
    console.log(`✅ Italia: ${result14.modifiedCount} paquete(s) actualizado(s) a "Europa"`);
    
    // 15. Actualizar PKG003 - Salvador de Bahía a Brasil
    const result15 = await Paquete.updateMany(
      { nombre: { $regex: /PKG003.*Salvador.*Bahía|PKG003.*Salvador.*Bahia/i } },
      { $set: { categoria: 'Brasil' } }
    );
    console.log(`✅ PKG003 - Salvador de Bahía: ${result15.modifiedCount} paquete(s) actualizado(s) a "Brasil"`);
    
    // 16. Actualizar PKG011 - Natal + Pipa a Brasil
    const result16 = await Paquete.updateMany(
      { nombre: { $regex: /PKG011.*Natal.*Pipa/i } },
      { $set: { categoria: 'Brasil' } }
    );
    console.log(`✅ PKG011 - Natal + Pipa: ${result16.modifiedCount} paquete(s) actualizado(s) a "Brasil"`);
    
    // 17. Actualizar PKG010 - Porto de Galinhas a Brasil
    const result17 = await Paquete.updateMany(
      { nombre: { $regex: /PKG010.*Porto.*Galinhas/i } },
      { $set: { categoria: 'Brasil' } }
    );
    console.log(`✅ PKG010 - Porto de Galinhas: ${result17.modifiedCount} paquete(s) actualizado(s) a "Brasil"`);
    
    // 18. Actualizar PKG006 - Natal a Brasil
    const result18 = await Paquete.updateMany(
      { nombre: { $regex: /PKG006.*Natal/i } },
      { $set: { categoria: 'Brasil' } }
    );
    console.log(`✅ PKG006 - Natal: ${result18.modifiedCount} paquete(s) actualizado(s) a "Brasil"`);
    
    // 19. Actualizar PKG002 - Natal a Brasil
    const result19 = await Paquete.updateMany(
      { nombre: { $regex: /PKG002.*Natal/i } },
      { $set: { categoria: 'Brasil' } }
    );
    console.log(`✅ PKG002 - Natal: ${result19.modifiedCount} paquete(s) actualizado(s) a "Brasil"`);
    
    // 20. Actualizar paquetes de Brasil que no tengan categoría Brasil
    const result20 = await Paquete.updateMany(
      {
        $or: [
          { destino: { $regex: /brasil|brazil|salvador.*bahía|salvador.*bahia|natal|pipa|porto.*galinhas/i } },
          { nombre: { $regex: /brasil|brazil|salvador.*bahía|salvador.*bahia|natal|pipa|porto.*galinhas/i } }
        ],
        categoria: { $ne: 'Brasil' }
      },
      { $set: { categoria: 'Brasil' } }
    );
    console.log(`✅ Brasil (destinos varios): ${result20.modifiedCount} paquete(s) actualizado(s) a "Brasil"`);
    
    // 21. Eliminar categoría "Otros" - asignar categorías basadas en destino
    // Primero, intentar detectar categorías para paquetes con "Otros"
    const otrosPaquetes = await Paquete.find({ categoria: { $in: ['Otros', 'Otro', 'otros', 'otro'] } });
    let otrosActualizados = 0;
    
    for (const paquete of otrosPaquetes) {
      let nuevaCategoria = 'Cultural'; // Default si no se puede detectar
      const destinoLower = (paquete.destino || '').toLowerCase();
      const nombreLower = (paquete.nombre || '').toLowerCase();
      const textoCompleto = `${destinoLower} ${nombreLower}`;
      
      // Detectar categoría basada en destino/nombre
      if (textoCompleto.includes('italia') || textoCompleto.includes('italy') || textoCompleto.includes('venecia') || textoCompleto.includes('puglia')) {
        nuevaCategoria = 'Europa';
      } else if (textoCompleto.includes('brasil') || textoCompleto.includes('brazil') || textoCompleto.includes('natal') || textoCompleto.includes('salvador') || textoCompleto.includes('bahía') || textoCompleto.includes('bahia') || textoCompleto.includes('pipa') || textoCompleto.includes('porto de galhinas')) {
        nuevaCategoria = 'Brasil';
      } else if (textoCompleto.includes('argentina') || textoCompleto.includes('bariloche') || textoCompleto.includes('mendoza') || textoCompleto.includes('cataratas') || textoCompleto.includes('iguazú') || textoCompleto.includes('iguazu')) {
        nuevaCategoria = 'Argentina';
      } else if (textoCompleto.includes('miami') || textoCompleto.includes('orlando') || textoCompleto.includes('estados unidos') || textoCompleto.includes('usa')) {
        nuevaCategoria = 'Estados Unidos';
      } else if (textoCompleto.includes('cancún') || textoCompleto.includes('cancun') || textoCompleto.includes('punta cana') || textoCompleto.includes('playa del carmen') || textoCompleto.includes('caribe')) {
        nuevaCategoria = 'Caribe';
      } else if (textoCompleto.includes('méxico') || textoCompleto.includes('mexico')) {
        nuevaCategoria = 'México';
      } else if (textoCompleto.includes('china') || textoCompleto.includes('japón') || textoCompleto.includes('japon') || textoCompleto.includes('asia')) {
        nuevaCategoria = 'Asia';
      }
      
      await Paquete.updateOne(
        { _id: paquete._id },
        { $set: { categoria: nuevaCategoria } }
      );
      otrosActualizados++;
    }
    console.log(`✅ Categoría "Otros" eliminada: ${otrosActualizados} paquete(s) reasignado(s) a categorías apropiadas`);
    
    console.log('\n✅ Actualización de categorías completada');
    
    // Mostrar resumen
    const summary = await Paquete.aggregate([
      {
        $group: {
          _id: '$categoria',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    console.log('\n📊 Resumen de categorías:');
    summary.forEach(item => {
      console.log(`   ${item._id || 'Sin categoría'}: ${item.count} paquete(s)`);
    });
    
    await mongoose.disconnect();
    console.log('\n✅ Desconectado de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al actualizar categorías:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Ejecutar la actualización
updatePackageCategories();

