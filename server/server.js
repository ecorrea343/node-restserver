const express = require('express')
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
    res.json({ body })
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

let port = process.env.PORT
app.listen(port, () => {
    console.log('Escuchando puerto', port);
})