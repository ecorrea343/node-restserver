const express = require('express');
const { verificarToken , verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');



//=======================
// Obtener Producto
//=======================
app.get('/productos', verificarToken, (req,res) => {

    //Aca vamso a hacer la paginacion de esta llamda , 

    let desde = req.query.desde || 0;
    desde = Number(desde);
    // Traer Todos los productos 
    Producto.find({ disponible: true }) // Disponible es un parametro del la coleccion , que permite que todos lso que esten en TRUE se meustren , sino , no apareceran.
            .populate('usuario', 'nombre email')//Sirve para solamente mostrar lo que necesitas en este caso referencio el model y los paramtros qeu quiero que vea el usuario.
            .populate('categoria', 'descripcion')
            .skip(desde)
            .limit(5)
            .exec( ( err, productos ) => {
        
        if (err) {

            return res.status(500).json({
                ok:false,
                message: 'Error en la busqueda de todos los productos',
                err
            })
        
        }

        res.json({

            ok:true,
            message:'La busqueda de Productos es Exitosa',
            productos

        })

    })
});

//=======================
// Obtener Producto Totales
//=======================
app.get('/productos/todos', [verificarToken, verificaAdmin_Role], (req,res) => {

    //Aca vamso a hacer la paginacion de esta llamda , 

    let desde = req.query.desde || 0;
    desde = Number(desde);
    // Traer Todos los productos 
    Producto.find({ }) // Disponible es un parametro del la coleccion , que permite que todos lso que esten en TRUE se meustren , sino , no apareceran.
            .populate('usuario', 'nombre email')//Sirve para solamente mostrar lo que necesitas en este caso referencio el model y los paramtros qeu quiero que vea el usuario.
            .populate('categoria', 'descripcion')
            .skip(desde)
            .limit(5)
            .exec( ( err, productos ) => {
        
        if (err) {

            return res.status(500).json({
                ok:false,
                message: 'Error en la busqueda de todos los productos',
                err
            })
        
        }

        res.json({

            ok:true,
            message:'La busqueda de Productos es Exitosa',
            productos

        })

    })
});

//=======================
// Obtener un Producto
//=======================
app.get('/productos/:id',verificarToken,( req, res ) => {

    let id = req.params.id 

    Producto.findById( id)
            .populate('usuario' , 'nombre email')
            .populate('categoria' , 'descripcion')
            .exec(
                ( err, productoDB ) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: 'Error en la busqueda de producto por ID',
                            err
                        })
                        
                    }
            
                    if (!productoDB) {
                        return res.status(400).json({
                            ok:false,
                            message:'No se a encontrado el Producto'
                        })
                    }
            
                    res.json({
                        ok:true,
                        productoDB
                    })
            
                }
            )
        

});
//=======================
// Buscar Producto
//=======================
app.get('/productos/buscar/:busqueda', verificarToken , (req, res) => {

    let busqueda = req.params.busqueda;

    let regex = new RegExp(busqueda,'i')

    Producto.find({ nombre:regex })
            .populate('categoria' , 'nombre')
            .exec( (err, productoRespuesta ) => {

                if (err) {
                    return res.status(500).json({
                        ok:false,
                        message:'Problemas con la busqueda',
                        err
                    })
                }

                if (!productoRespuesta) {
                    return res.status(400).json({
                        ok:false,
                        message:'lA BUSQUEDA NO EXISTE'
                    })
                    
                }

                res.json({
                    ok:true,
                    producto:productoRespuesta
                })
                
            })

} )


//=======================
// Crear Producto
//=======================
app.post('/productos',verificarToken, (req,res) => {

    let body = req.body
    let producto = new Producto({
        usuario : req.usuario._id,
        nombre:body.nombre,
        precioUni:body.precioUni,
        descripcion:body.descripcion,
        disponible:body.disponible,
        categoria: body.categoria,
    })

    producto.save((err, productoDB) => {

        if(err){
            return res.status(500).json({
                ok:false,
                message:'Error al crear el producto',
                err
            })
        }

        if(!producto){
            return res.status(400).json({
                ok:false,
                message:'EL Producto no existe',
                err
            })
        }

        res.json({
            ok:true,
            message:'Ingreso de Producto Correcto',
            producto:productoDB
        })

    })

})

//=======================
// Actualizar Producto
//=======================
app.put('/productos/:id', verificarToken ,( req, res ) => {

    let id = req.params.id;
    let body = req.body;

    
    Producto.findById(id, (err, productoDB) => {

        if(err){
            return res.status(500).json({
                ok:false,
                message:'Error de Producto'
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok:false,
                message:'El producto no existe y no se puede Actualizar'
            })
        }

        
            productoDB.nombre      = body.nombre,
            productoDB.precioUni   = body.precioUni,
            productoDB.descripcion = body.descripcion,
            productoDB.disponible  = body.disponible,
            productoDB.categoria   = body.categoria,
        
        
        productoDB.save((err, productoGuardado) => {

            if(err){
                return res.status(500).json({
                    ok:false,
                    message:'Error de Producto'
                })
            }

            res.json({
                ok:true,
                message:'Actualizacion Correcta',
                producto:productoGuardado
           })

        })
        
    })

})

//=======================
// Eliminar Producto
//=======================

app.delete('/productos/:id',verificarToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id , (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok:false,
                message:'Error enla eliminacion de producto',
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok:false,
                message:'No se encontro el id del producto',
                err
            })
        }

        // En este caso no vamos a borrar el registro como tal , sino que lo colcoaremos no disponible par ale usuario

        productoDB.disponible = false;

        productoDB.save((err, productoEliminado) => {

            if (err) {
                return res.status(500).json({
                    ok:false,
                    message:'Error en la eliminacion de producto',
                    err
                })
            }

            res.json({
                ok:true,
                producto:productoEliminado,
                message:'Producto Eliminado.'
            })
            
        })
   
    })

})

module.exports = app;
