const express = require('express');
const fs      = require('fs');
const path    = require('path');
const { verificaTokenImg }      = require('../middlewares/autenticacion');
let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;
    
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);

    if (!fs.existsSync( pathImagen )  ) {

        let pathNoimage = path.resolve(__dirname,'../assets/no-image-found.jpg');
        return res.sendFile(pathNoimage);

    }
    
    res.sendFile(pathImagen);
    

})

module.exports = app;