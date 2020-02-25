
const express = require("express");
let { verificarToken } = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/categoria');

//===========================================
//Obtener todas las categorias
//===========================================
app.get('/categoria',verificarToken,(req,res) =>{


});
//===========================================
//Obtener una categoria
//===========================================
app.get('/categoria/:id',verificarToken,(req,res) =>{

    
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

    
});
//===========================================
//Borrar las categorias
//===========================================
app.delete('/categoria/:id',verificarToken,(req,res) =>{
//Solo un administrador PUEDE borrar
    
});

module.exports = app;





