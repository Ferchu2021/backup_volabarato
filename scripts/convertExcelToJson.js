"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const XLSX = __importStar(require("xlsx"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function convertExcelToJson() {
    const excelFiles = [
        'C:\\Users\\Administrator\\Downloads\\Paquetes Low.xlsx',
        'C:\\Users\\Administrator\\Downloads\\Paquetes Noviembre.xlsx',
        'C:\\Users\\Administrator\\Downloads\\Paquetes Aero.xlsx'
    ];
    const outputDir = path.join(process.cwd(), 'scripts', 'paquetes');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    for (const excelFile of excelFiles) {
        if (!fs.existsSync(excelFile)) {
            console.log(`Archivo no encontrado: ${excelFile}`);
            continue;
        }
        console.log(`\nLeyendo: ${path.basename(excelFile)}`);
        const workbook = XLSX.readFile(excelFile);
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
            console.log(`No se encontro ninguna hoja`);
            continue;
        }
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
            console.log(`No se encontro la hoja`);
            continue;
        }
        const data = XLSX.utils.sheet_to_json(worksheet, {
            raw: false,
            defval: null
        });
        console.log(`${data.length} filas encontradas`);
        if (data.length > 0 && data[0]) {
            console.log(`Columnas: ${Object.keys(data[0]).join(', ')}`);
        }
        try {
            const paquetes = [];
            for (let i = 0; i < data.length; i++) {
                const r = data[i];
                const id = String(r['ID'] || '').trim();
                const destino = String(r['Destino'] || '').trim();
                const fechaRaw = r['Fecha Salida'] || '';
                let fecha = '';
                if (fechaRaw && typeof fechaRaw === 'string' && fechaRaw.includes('/')) {
                    const partes = fechaRaw.split('/');
                    if (partes.length === 3) {
                        fecha = partes[2] + '-' + partes[1].padStart(2, '0') + '-' + partes[0].padStart(2, '0');
                    }
                }
                const noches = r['Noches'] || '';
                const hotel = String(r['Hotel Principal'] || '').trim();
                // Detectar moneda desde el nombre de las columnas de precio
                let moneda = 'USD'; // Por defecto
                let precioRaw = null;
                let precioBaseRaw = null;
                // Buscar todas las columnas de precio
                const precioKeys = Object.keys(r).filter(key => key.toLowerCase().includes('precio total') ||
                    key.toLowerCase().includes('precio final'));
                const precioBaseKeys = Object.keys(r).filter(key => key.toLowerCase().includes('precio base'));
                // Detectar moneda desde el nombre de la columna
                for (const key of precioKeys) {
                    const keyUpper = key.toUpperCase();
                    if (keyUpper.includes('USD')) {
                        moneda = 'USD';
                        precioRaw = r[key];
                        break;
                    }
                    else if (keyUpper.includes('ARS') || (keyUpper.includes('PESO') && !keyUpper.includes('MEX'))) {
                        moneda = 'ARS';
                        precioRaw = r[key];
                        break;
                    }
                    else if (keyUpper.includes('BRL') || keyUpper.includes('REAL')) {
                        moneda = 'BRL';
                        precioRaw = r[key];
                        break;
                    }
                    else if (keyUpper.includes('MXN') || keyUpper.includes('PESO MEX')) {
                        moneda = 'MXN';
                        precioRaw = r[key];
                        break;
                    }
                    else if (keyUpper.includes('EUR') || keyUpper.includes('EURO')) {
                        moneda = 'EUR';
                        precioRaw = r[key];
                        break;
                    }
                    else if (keyUpper.includes('COP')) {
                        moneda = 'COP';
                        precioRaw = r[key];
                        break;
                    }
                    else if (keyUpper.includes('CLP')) {
                        moneda = 'CLP';
                        precioRaw = r[key];
                        break;
                    }
                    else if (keyUpper.includes('PEN')) {
                        moneda = 'PEN';
                        precioRaw = r[key];
                        break;
                    }
                }
                // Si no se encontró, usar la primera columna de precio disponible
                if (!precioRaw && precioKeys.length > 0) {
                    precioRaw = r[precioKeys[0]];
                }
                if (!precioRaw) {
                    precioRaw = r['Precio Total USD'] || r['Precio Total'] || r['Precio'] || '0';
                }
                // Buscar precio base con la misma moneda
                for (const key of precioBaseKeys) {
                    const keyUpper = key.toUpperCase();
                    if ((moneda === 'USD' && keyUpper.includes('USD')) ||
                        (moneda === 'ARS' && (keyUpper.includes('ARS') || (keyUpper.includes('PESO') && !keyUpper.includes('MEX')))) ||
                        (moneda === 'BRL' && (keyUpper.includes('BRL') || keyUpper.includes('REAL'))) ||
                        (moneda === 'MXN' && (keyUpper.includes('MXN') || keyUpper.includes('PESO MEX'))) ||
                        (moneda === 'EUR' && (keyUpper.includes('EUR') || keyUpper.includes('EURO'))) ||
                        (moneda === 'COP' && keyUpper.includes('COP')) ||
                        (moneda === 'CLP' && keyUpper.includes('CLP')) ||
                        (moneda === 'PEN' && keyUpper.includes('PEN'))) {
                        precioBaseRaw = r[key];
                        break;
                    }
                }
                if (!precioBaseRaw && precioBaseKeys.length > 0) {
                    precioBaseRaw = r[precioBaseKeys[0]];
                }
                if (!precioBaseRaw) {
                    precioBaseRaw = r['Precio Base USD'] || r['Precio Base'] || '0';
                }
                let precio = 0;
                if (typeof precioRaw === 'number') {
                    precio = precioRaw;
                }
                else if (precioRaw) {
                    const precioStr = String(precioRaw).replace(/[^0-9.-]/g, '');
                    precio = parseFloat(precioStr) || 0;
                }
                let precioBase = 0;
                if (typeof precioBaseRaw === 'number') {
                    precioBase = precioBaseRaw;
                }
                else if (precioBaseRaw) {
                    const precioBaseStr = String(precioBaseRaw).replace(/[^0-9.-]/g, '');
                    precioBase = parseFloat(precioBaseStr) || 0;
                }
                const aerolinea = String(r['AerolÃ­nea'] || '').trim();
                const origen = String(r['Origen'] || '').trim();
                const modalidad = String(r['Modalidad Plan'] || '').trim();
                const obs = String(r['Observaciones'] || '').trim();
                if (destino && precio > 0) {
                    const p = {
                        nombre: (id ? id + ' - ' : '') + destino,
                        destino: destino,
                        fecha: fecha || new Date().toISOString().split('T')[0],
                        precio: precio,
                        moneda: moneda,
                        descripcion: destino + (noches ? ' - ' + noches + ' noches' : '') + (hotel ? ' en ' + hotel : '') + (obs ? '. ' + obs : ''),
                        categoria: 'Otro',
                        destacado: false,
                        activo: true
                    };
                    if (noches) {
                        const numNoches = parseInt(String(noches)) || 0;
                        if (numNoches > 0) {
                            p.duracion = (numNoches + 1) + ' dias / ' + numNoches + ' noches';
                        }
                    }
                    if (fecha) {
                        p.fechaSalida = fecha;
                    }
                    if (precioBase > precio && precioBase > 0) {
                        p.precioAnterior = precioBase;
                    }
                    p.incluye = [];
                    if (aerolinea)
                        p.incluye.push('Vuelo con ' + aerolinea);
                    if (modalidad)
                        p.incluye.push('Plan ' + modalidad);
                    if (hotel)
                        p.incluye.push('Alojamiento en ' + hotel);
                    if (origen)
                        p.incluye.push('Salida desde ' + origen);
                    if (p.incluye.length === 0)
                        p.incluye.push('Paquete turistico completo');
                    paquetes.push(p);
                }
            }
            const outputFile = path.join(outputDir, path.basename(excelFile, '.xlsx') + '.json');
            fs.writeFileSync(outputFile, JSON.stringify(paquetes, null, 2), 'utf-8');
            console.log(`Convertido: ${paquetes.length} paquetes guardados en ${path.basename(outputFile)}`);
        }
        catch (error) {
            console.error(`âŒ ERROR procesando archivo ${excelFile}:`, error.message);
            console.error(`Stack:`, error.stack);
            continue;
        }
    }
    console.log('\nConversion completada');
    console.log('Ahora puedes ejecutar: npm run load:paquetes');
}
convertExcelToJson();
