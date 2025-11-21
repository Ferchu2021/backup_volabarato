import * as fs from 'fs';
import * as path from 'path';

/**
 * Script para corregir las monedas en los archivos JSON de paquetes
 * basándose en la descripción y los valores de los precios
 */

interface Paquete {
  nombre: string;
  destino: string;
  precio: number;
  moneda: string;
  descripcion?: string;
  [key: string]: any;
}

function inferirMoneda(paquete: Paquete): string {
  const descripcion = (paquete.descripcion || '').toUpperCase();
  const precio = paquete.precio;
  
  // Si la descripción menciona explícitamente la moneda
  if (descripcion.includes('PRECIOS EN ARS') || descripcion.includes('PRECIO EN ARS')) {
    return 'ARS';
  }
  if (descripcion.includes('PRECIOS EN USD') || descripcion.includes('PRECIO EN USD')) {
    return 'USD';
  }
  if (descripcion.includes('PRECIOS EN BRL') || descripcion.includes('PRECIO EN BRL')) {
    return 'BRL';
  }
  if (descripcion.includes('PRECIOS EN EUR') || descripcion.includes('PRECIO EN EUR')) {
    return 'EUR';
  }
  
  // Inferir por el valor del precio
  // Precios muy altos (> 100,000) probablemente son ARS
  if (precio > 100000) {
    return 'ARS';
  }
  
  // Precios entre 100 y 50,000 probablemente son USD o EUR
  if (precio >= 100 && precio <= 50000) {
    return 'USD';
  }
  
  // Por defecto, mantener USD
  return 'USD';
}

function corregirMonedasEnArchivo(archivoPath: string): void {
  console.log(`\nProcesando: ${path.basename(archivoPath)}`);
  
  const contenido = fs.readFileSync(archivoPath, 'utf-8');
  const paquetes: Paquete[] = JSON.parse(contenido);
  
  let cambios = 0;
  
  for (const paquete of paquetes) {
    const monedaOriginal = paquete.moneda || 'USD';
    const monedaCorrecta = inferirMoneda(paquete);
    
    if (monedaOriginal !== monedaCorrecta) {
      console.log(`  ⚠️  ${paquete.nombre}:`);
      console.log(`     Moneda original: ${monedaOriginal}`);
      console.log(`     Moneda corregida: ${monedaCorrecta} (precio: ${paquete.precio})`);
      paquete.moneda = monedaCorrecta;
      cambios++;
    }
  }
  
  if (cambios > 0) {
    fs.writeFileSync(archivoPath, JSON.stringify(paquetes, null, 2), 'utf-8');
    console.log(`\n✅ ${cambios} monedas corregidas en ${path.basename(archivoPath)}`);
  } else {
    console.log(`✅ Todas las monedas están correctas en ${path.basename(archivoPath)}`);
  }
}

function main(): void {
  const paquetesDir = path.join(process.cwd(), 'scripts', 'paquetes');
  
  if (!fs.existsSync(paquetesDir)) {
    console.error('❌ No se encontró el directorio scripts/paquetes');
    return;
  }
  
  const archivos = fs.readdirSync(paquetesDir).filter(f => f.endsWith('.json'));
  
  if (archivos.length === 0) {
    console.error('❌ No se encontraron archivos JSON');
    return;
  }
  
  console.log('🔍 Corrigiendo monedas en archivos JSON...\n');
  
  for (const archivo of archivos) {
    const archivoPath = path.join(paquetesDir, archivo);
    corregirMonedasEnArchivo(archivoPath);
  }
  
  console.log('\n✅ Corrección completada');
  console.log('Ahora puedes ejecutar: npm run load:paquetes');
}

main();

