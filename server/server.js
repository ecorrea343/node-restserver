const express = require('express')
const mongoose = require('mongoose')
const path =require('path')

const app = express()
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

app.use(express.static (path.resolve( __dirname , '../public')))


//Configuracion Gloabal de Rutas
app.use(require('./routes/index'))

require('./config/config')

// app.get('/', function(req, res) {
//     res.json('Hello World')
// })



//Forma de conexionde mongoDB en forma local)(hay qeu definir el puerto)
//mongoose.connect('mongodb://localhost:27017/cafe', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (err, res) => {
        if (err) {
            console.log("ERROR AL CONECTAR");
            throw err;
        }
        console.log('BBDD Online');


    })


let port = process.env.PORT
app.listen(port, () => {
    console.log('Escuchando puerto', port);
})