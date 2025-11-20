import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Paquete } from '../src/models/Paquete';

dotenv.config();

interface PaqueteFromFile {
  nombre: string;
  destino: string;
  fecha: string;
  precio: number;
  precioAnterior?: number;
  descripcion?: string;
  duracion?: string;
  fechaSalida?: string;
  fechaRegreso?: string;
  imagenes?: string[];
  incluye?: string[];
  noIncluye?: string[];
  requisitos?: string[];
  categoria?: string;
  destacado?: boolean;
  cuposDisponibles?: number;
  activo?: boolean;
}

const loadPaquetesFromFile = async () => {
  try {
    console.log('Conectando a MongoDB...');
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI no estÃ¡ definida');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB');
    
    const paquetesDir = path.join(__dirname, 'paquetes');
    if (!fs.existsSync(paquetesDir)) {
      fs.mkdirSync(paquetesDir, { recursive: true });
      console.log('Directorio creado: scripts/paquetes/');
      await mongoose.connection.close();
      return;
    }
    
    const files = fs.readdirSync(paquetesDir).filter(file => file.endsWith('.json'));
    if (files.length === 0) {
      console.log('No se encontraron archivos JSON en scripts/paquetes/');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`Encontrados ${files.length} archivo(s)`);
    let totalCreados = 0;
    let totalActualizados = 0;
    let totalErrores = 0;
    
    for (const file of files) {
      console.log(`Procesando: ${file}`);
      try {
        const filePath = path.join(paquetesDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const paquetesData: PaqueteFromFile[] = JSON.parse(fileContent);
        
        if (!Array.isArray(paquetesData)) {
          console.error(`El archivo ${file} no contiene un array`);
          totalErrores++;
          continue;
        }
        
        for (const paqueteData of paquetesData) {
          try {
            const existing = await Paquete.findOne({ nombre: paqueteData.nombre });
            if (existing) {
              Object.assign(existing, {
                ...paqueteData,
                fecha: new Date(paqueteData.fecha),
                fechaSalida: paqueteData.fechaSalida ? new Date(paqueteData.fechaSalida) : undefined,
                fechaRegreso: paqueteData.fechaRegreso ? new Date(paqueteData.fechaRegreso) : undefined,
                activo: paqueteData.activo !== undefined ? paqueteData.activo : true
              });
              await existing.save();
              console.log(`   Actualizado: ${paqueteData.nombre}`);
              totalActualizados++;
            } else {
              const nuevo = new Paquete({
                ...paqueteData,
                fecha: new Date(paqueteData.fecha),
                fechaSalida: paqueteData.fechaSalida ? new Date(paqueteData.fechaSalida) : undefined,
                fechaRegreso: paqueteData.fechaRegreso ? new Date(paqueteData.fechaRegreso) : undefined,
                activo: paqueteData.activo !== undefined ? paqueteData.activo : true
              });
              await nuevo.save();
              console.log(`   Creado: ${paqueteData.nombre}`);
              totalCreados++;
            }
          } catch (error: any) {
            console.error(`   Error: ${paqueteData.nombre} - ${error.message}`);
            totalErrores++;
          }
        }
      } catch (error: any) {
        console.error(`Error en archivo ${file}: ${error.message}`);
        totalErrores++;
      }
    }
    
    console.log(`\nResumen: Creados: ${totalCreados}, Actualizados: ${totalActualizados}, Errores: ${totalErrores}`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

loadPaquetesFromFile();
