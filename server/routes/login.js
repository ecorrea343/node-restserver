const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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

        let token = jwt.sign({
            usuario: usuariodb
        }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN })

        res.json({
            ok: true,
            usuario: usuariodb,
            token //: token  Cuando uno quiere colocar un valor del mismo nombre en ES6 es redundante  
        })
    })
})

// Configuraion de Google

async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    
    // console.log(payload.name);
    // console.log(payload.email);
    // console.log(payload.picture);

    return{

        nombre : payload.name,
        email  : payload.email,
        img    : payload.picture,
        google : true

    }
    
    //const userid = payload['sub'];
 
  }
  //verify().catch(console.error);




app.post('/google', async  (req, res) => {

    let token = req.body.idtoken;
    
    let googleUser = await verify( token )
    .catch( e=>{
        return res.status(403).json({
            ok:false,
            err:e
        })
    } )

    Usuario.findOne({ email: googleUser.email }, (err,usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok:true,
                err
            })
        }

        if (usuarioDB) {
            
            
            if ( usuarioDB.google=== false ) {
               // Si el usuario ya se registro anteriormente con su correo , no puede registrarse con la cuenta  de Google. 
                return res.status(400).json({
                    ok: false,
                    err:{
                        message:'Debe de autenticarse con su usuario normal'
                    }
                })

            }else{

                let token = jwt.sign({

                    usuario: usuarioDB,

                }, process.env.SEED_TOKEN, { expiresIn : process.env.CADUCIDAD_TOKEN })

                return res.status(200).json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                })
            }
        }else{
            //Si el usuario no exite en nuestra base de datos.

            let usuario = new Usuario()

            usuario.nombre = googleUser.nombre;
            usuario.email  = googleUser.email;
            usuario.img    = googleUser.img;
            usuario.google = true;
            usuario.password = ':)'; 

            usuario.save( (err, usuarioDB) => {

                if (err) {
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }

                let token = jwt.sign({

                    usuario: usuarioDB,

                }, process.env.SEED_TOKEN, { expiresIn : process.env.CADUCIDAD_TOKEN })

                return res.status(200).json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                })

            } )
        }

    } )

});
module.exports = app