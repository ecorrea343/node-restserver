const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

//Default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id     = req.params.id

    //En el caso de que no alla archivos mandar mensaje de error
    if (!req.files) {
        return res.status(400).json({
            ok:false,
            err:{
                message:'No se ha seleccionado ningun archivo'
            }
        })   
    }

    let tiposValidos = ['productos','usuarios'];

    if (tiposValidos.indexOf( tipo ) < 0 ) {
        
        return res.status(200).json({
            ok:false,
            err:{
                message:'Los tipos permitidos son ' + tiposValidos.join(', ')
            }
        })
    }

    //Si esta todo bien entonces se sube el archivo por parametr de nombre 
    //archivo  req.files.(cualquier nombre que se te ocurra ) como aca abajo.
    let archivo  = req.files.archivo;

    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length -1]
    //Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']

    if (extensionesValidas.indexOf(extension) < 0 ) { //con IndexOf pued buscar dentro del array algun coincidencia
        
        return res.status( 400 ).json({
            ok:false,
            message:'Ingresa un archivo  con la extension correcta , estas son las correctas ' + extensionesValidas.join(', '),
            ext:extension
        })
        
    }

    // cambiar nombre al archivo
    //188888kuassasdasd-123.jpg
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;


    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }` , (err) => {

        if (err) {
            return res.status(500).json({
                ok:false,
                err
            })
        }

        res.json({

            ok:true,
            message:'Archivo cargado satisfactoriamente',
        
        })

    })

})


module.exports = app;