require('./config/config')

const express = require('express');
// Using Node.js `require()`
const mongoose = require('mongoose');


const bodyParser = require('body-parser');
const app = express();

// parse application/x-www-form-urlencoded son middlewheres, cada peticion siempre pasa por estas lineas
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
    //Para incluir otro archivo y usar las rutas de usuario
app.use(require('./routes/usuario'));

//conectar a la base de datos mongodb
mongoose.connect(process.env.URLDB, (error, resp) => {
    if (error) {
        throw new error;
    }
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', process.env.PORT)
});