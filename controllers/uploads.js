const path = require('path');
const fs = require('fs');
const { request, response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");

const fileUpload = async ( req = request, res = response  ) => {

    const {tipo, id} = req.params;
    const tiposValidos = ['usuarios', 'medicos', 'hospitales'];
    
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok:false,
            msg:'Tipo no permitido'
        }) 
    }
    //Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok:false,
            msg:'No hay ningun archivo.'
        })
      }
    //Procesar la imagen
    const file = req.files.imagen;
    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length -1];
    //Validar extension
    const extensionValida = ['png', 'jpg','jpeg', 'gif'];

    if (!extensionValida.includes(extensionArchivo)) {
        return res.status(400).json({
            ok:false,
            msg:'Extension no permitida'
        }) 
    };

    //Generar el nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;
    //Path para guardar la imagen
    const path = `./uploads/${ tipo  }/${nombreArchivo}`;
    //Moven la imagen
    file.mv(path, function(err) {
        if (err){
            console.log(err);
            return res.status(500).json({
                ok:false,
                msg:'Error al subir el archivo'
            });
        }
        //Actualizar BD
        actualizarImagen( tipo, id, nombreArchivo );

        res.json({
            ok:true,
            msg:'Archivo cargado',
            nombreArchivo
        })

    });




}

const retornaImagen = ( req, res = response)=>{
    const {tipo, foto} = req.params;
    const pathImg = path.join( __dirname, `../uploads/${ tipo }/${ foto }` );
    //imagen por defecto
    if( fs.existsSync( pathImg ) )
    {
        res.sendFile( pathImg );
    }
    else
    {
        const pathNoImg = path.join( __dirname, '../uploads/no-img.jpg' );
        res.sendFile( pathNoImg );
    }
    
}



module.exports = {
    fileUpload,
    retornaImagen
}


