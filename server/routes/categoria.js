
const express = require("express");
let { verificarToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/categoria');

//===========================================
//Obtener todas las categorias
//===========================================
app.get('/categoria',verificarToken,( req, res ) =>{

    Categoria.find({})
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            
            if (err) {
                return res.status(500).json({

                    ok:false,
                    message:'Hay un error en Obtener todas las Categorias',
                    err

                })
            }

            res.json({

                ok:true,
                categorias
            
            })
            
        });

});
//===========================================
//Obtener una categoria
//===========================================
app.get('/categoria/:id',verificarToken,(req,res) =>{

    let id = req.params.id;


    Categoria.findById(id , (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            categoriaDB
        })

    })

    
});
//===========================================
//Crear las categorias
//===========================================
app.post('/categoria',verificarToken,(req,res) =>{
// regresar nueva categoria 
// req.usuario,id

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario:req.usuario._id
    });

    categoria.save( ( err, categoriaDB ) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            categoria:categoriaDB
        });

    });
});
//===========================================
//Actualizar las categorias
//===========================================
app.put('/categoria/:id',verificarToken,(req,res) =>{

    let id   = req.params.id;
    let body = req.body;

    let desCategoria = { 
        descripcion : body.descripcion
    };

    Categoria.findByIdAndUpdate( id, desCategoria, { new : true, runValidators:true}, ( err, categoriaDB ) => {

        if (err) {
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria:categoriaDB
        })

    });
    
});

//===========================================
//Borrar las categorias
//===========================================
app.delete('/categoria/:id', [ verificarToken, verificaAdmin_Role ],( req, res ) =>{
    //Solo un administrador PUEDE borrar
        
    let id = req.params.id;
    
    Categoria.findByIdAndRemove(id, ( err, categoriaDB ) => {
    
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            })
        }
    
        if (!categoriaDB) {
    
            return res.status(400).json({
                ok:false,
                err:{
                    messege: 'El id no existe'
                }
            })
        }
        
        res.json({
            ok:true,
            categoria:categoriaDB,
            message:'Categoria Eliminada'
        })
    
    });
});    
//===========================================
//Borrar las categorias
//===========================================
app.delete('/categoria/desuso/:id', [ verificarToken, verificaAdmin_Role ],( req, res ) =>{
//Solo un administrador PUEDE borrar
    
let id = req.params.id;

Categoria.findByIdAndRemove(id, ( err, categoriaDB ) => {

    if (err) {
        return res.status(500).json({
            ok:false,
            err
        })
    }

    if (!categoriaDB) {

        return res.status(400).json({
            ok:false,
            err:{
                messege: 'El id no existe'
            }
        })
    }
    categoriaDB.disponible = false;

        productoDB.save((err, categoriaEliminado) => {

            if (err) {
                return res.status(500).json({
                    ok:false,
                    message:'Error en la eliminacion de producto',
                    err
                })
            }

            res.json({
                ok:true,
                categoria:categoriaEliminado,
                messege: 'Categoria Borrada'
            });
            
        })

    });

});

module.exports = app;





