//================================
//Puerto
//================================

process.env.PORT = process.env.PORT || 3000;
//================================
//Entorno
//================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//================================
//Vendimiento del Token
//================================
//60seg*60min*24h*30d
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//================================
//Seed
//================================
// se pone process.env.SEED || para ocultarlo al subirlo a git o heroku, para que no lo vean los demas
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//================================
//Base de datos
//================================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//================================
//Google Client Id
//================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '725010532523-mbmbmprmaidhpa9j6cdrmuajri0ao4s4.apps.googleusercontent.com';