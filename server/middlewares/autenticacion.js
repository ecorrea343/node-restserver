const jwt = require('jsonwebtoken')

//======================================
// Verificar Token
//======================================

let verificarToken = (req, res, next) => {

    let token = req.get('token') // es un header personalizado , por defecto es "Authorization"
    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {  
        if (err) {
            return res.status(401).json({
                ok: false,
                err:{
                    message:'El token no es el correcto.'
                }
            })
        }  
        req.usuario = decoded.usuario  
        next()
    })

}


//==========================================
//  Verifica AdminRole
//=========================================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario

    if (usuario.role === 'ADMIN_ROLE') {

        next()

    } else {

        res.json({
            ok: false,
            err: {

                message: 'El usuario no es Administrador'

            }
        })
    
    }

}

//==========================================
//  Verifica TokenImg
//=========================================

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {  

        if (err) {
            return res.status(401).json({
                ok: false,
                err:{
                    message:'El token no es el correcto.'
                }
            })
        }
          
        req.usuario = decoded.usuario  
        next()
    })

}

module.exports = {

    verificarToken,
    verificaAdmin_Role,
    verificaTokenImg

}