const express = require('express')
const bcrypt = require('bcrypt')
const Usuario = require('../models/usuario')
const app = express()


app.post('/login', (req, res) => {

    let body = req.body
    Usuario.findOne({ email: body.email }, (err, usuariodb) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!usuariodb) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            })
        }

        if (!bcrypt.compareSync(body.password, usuariodb.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuariodb,
            token: '123'
        })
    })
})




module.exports = app