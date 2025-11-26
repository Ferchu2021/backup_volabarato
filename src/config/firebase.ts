import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Inicializar Firebase Admin SDK
let firebaseAdmin: admin.app.App | null = null;

// Log inicial para debugging
console.log('[FIREBASE] Iniciando configuración de Firebase Admin...');
console.log('[FIREBASE] FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✅ Configurado' : '❌ No configurado');
console.log('[FIREBASE] FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '✅ Configurado' : '❌ No configurado');
console.log('[FIREBASE] FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✅ Configurado' : '❌ No configurado');

try {
  // Verificar que las variables de entorno estén configuradas
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    console.warn('⚠️ Firebase Admin no configurado: Faltan variables de entorno');
    console.warn('   Variables requeridas: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
    console.warn('   Configura estas variables en Render → Environment');
  } else {
    // Solo inicializar si no hay una app ya inicializada
    if (!admin.apps.length) {
      // Reemplazar \\n por saltos de línea reales en la clave privada
      const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      
      firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
      
      console.log('✅ Firebase Admin inicializado correctamente');
      console.log(`   Proyecto: ${process.env.FIREBASE_PROJECT_ID}`);
    } else {
      firebaseAdmin = admin.app();
      console.log('✅ Firebase Admin ya estaba inicializado');
    }
  }
} catch (error: any) {
  console.error('❌ Error inicializando Firebase Admin:', error.message);
  console.error('   La autenticación con Firebase no estará disponible');
}

export default firebaseAdmin;
export { admin };

