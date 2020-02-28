//====================================
// PUERTO 
process.env.PORT = process.env.PORT || 3000;
//====================================

//====================================
// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'
    //====================================

//====================================
// Vencimineto del Token
/**
 * 60 segundos
 * 60 minutos
 * 24 horas
 * 30 dias
 */
process.env.CADUCIDAD_TOKEN = '48h'
    //====================================

//====================================
// Seed de autentigicacion
//====================================
process.env.SEED_TOKEN = 'secret'
    //====================================
    //
    //====================================

//====================================
// Base de Datos

let urlDB

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI
}
process.env.URLDB = urlDB;

//====================================

//====================================
// Google Client
process.env.CLIENT_ID = process.env.CLIENT_ID || '336659641798-djit4jhm494qmtdjmr7c2ib6acjl23c1.apps.googleusercontent.com'


//====================================