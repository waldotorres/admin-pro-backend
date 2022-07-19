const { response, request } = require("express");
const Hospital = require("../models/hospital");
const Medico = require("../models/medico");
const Usuario = require("../models/usuario");

const getTodo = async (req = request, res = response) =>{
    const busqueda = req.params.busqueda;
    const regExp = new RegExp( busqueda, 'i' );

    const [ usuarios, hospitales, medicos ] =  await Promise.all([
                        Usuario.find({ nombre:regExp }),
                        Hospital.find({ nombre:regExp }),
                        Medico.find({ nombre:regExp })
                    ]);

    res.json({
        ok:true,
        usuarios,
        medicos,
        hospitales

    });

}


const getDocumentoColeccion = async (req = request, res = response) =>{
    
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regExp = new RegExp( busqueda, 'i' );


    // return res.json({
    //     ok:true,
    //     msg:'Hello'
    // })

    // console.log(tabla, busqueda );
    // return

    let data = [];

    switch (tabla) {
        case 'medicos':
            data = await Medico.find({ nombre:regExp })
                                .populate('usuario', 'nombre img' )
                                .populate('hospital', 'nombre img' ) ;
            break;
        case 'usuarios':
            data = await Usuario.find({ nombre:regExp });
            break;
        case 'hospitales':
            data = await Hospital.find({ nombre:regExp })
                                .populate('usuario', 'nombre img' )
            break;
    
        default:
            return res.status(400).json({
                ok:false,
                msg:'La tabla no existe'
            })
    }

    

    res.json({
        ok:true,
        tabla,
        resultado: data

    });

}

module.exports = {
    getTodo,
    getDocumentoColeccion
}