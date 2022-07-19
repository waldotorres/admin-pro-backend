const fs = require('fs');
const Hospital = require("../models/hospital");
const Medico = require("../models/medico");
const Usuario = require("../models/usuario")


const borrarImagen = ( path )=>{
    if ( fs.existsSync( path)) 
    {
        fs.unlinkSync( path );
    }

}

const actualizarImagen = async (tipo, id, nombreArchivo)=>{

    let pathViejo ='';

    switch (tipo) {
        case 'usuarios':

            const usuario = await Usuario.findById(id);

            if (!usuario) {
                console.log('No se encontro el usuario');
                return false;
            }
            pathViejo = `./uploads/usuarios/${usuario.img}`;
            borrarImagen( pathViejo );
           
            //
            usuario.img = nombreArchivo;
            await usuario.save();
            return true;

        case 'medicos':
            const medico = await Medico.findById(id);

            if (!medico) {
                console.log('No se encontro el medico');
                return false;
            }
            pathViejo = `./uploads/medicos/${medico.img}`;
            borrarImagen( pathViejo );
           
            //
            medico.img = nombreArchivo;
            await medico.save();
            return true;
            break;
        case 'hospitales':
            const hospital = await Hospital.findById(id);

            if (!hospital) {
                console.log('No se encontro el hospital');
                return false;
            }
            pathViejo = `./uploads/hospitales/${hospital.img}`;
            borrarImagen( pathViejo );
           
            //
            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
            break;
    }

}

module.exports = {
    actualizarImagen
}