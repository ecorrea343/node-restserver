const express = require('express')
const mongoose = require('mongoose')

const app = express()
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

require('./config/config')
app.get('/', function(req, res) {
    res.json('Hello World')
})
app.get('/usuario', function(req, res) {
    res.json('GET usarios')
})
app.post('/usuario', function(req, res) {

    let body = req.body
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario',
            error: 'Error 400, BAD REQUEST'
        })
    } else {

        res.json({ persona: body })
    }
})
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id
    res.json({
        id
    })
})
app.delete('/usuario', function(req, res) {
    res.json('DELETE usarios')
})


//Forma de conexionde mongoDB en forma local)(hay qeu definir el puerto)
//mongoose.connect('mongodb://localhost:(puerto por definir)/my_database', (err, res) => {
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de Datos ONLINE!!!');

})


let port = process.env.PORT
app.listen(port, () => {
    console.log('Escuchando puerto', port);
})