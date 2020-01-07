//====================================
// PUERTO 
//====================================
process.env.PORT = process.env.PORT || 3000;

//====================================
// Entorno
//====================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//====================================
// Base de Datos
//====================================
let urlDB

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb+srv://strider:XcmJGFY5a4GW9PTk@cluster0-mzcgx.mongodb.net/cafe?retryWrites=true&w=majority'
}
process.env.URLDB = urlDB;