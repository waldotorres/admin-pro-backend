const { response } = require("express");
const Medico = require("../models/medico");

const getMedicos = async ( req, res = response )=>{

    const medicos = await Medico.find()
                            .populate('hospital', 'nombre')
                            .populate('usuario', 'nombre');

    res.json({
        ok:true,
        medicos
    })
}

const crearMedico = async ( req, res = response )=>{

    try {
        const medico = new Medico( req.body );
        medico.usuario = req.uid;
    
        await medico.save();
    
        res.json({
            ok:true,
            medico
        })    
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"Hable con el administrador - medico"
        });
    }
    
}

const actualizarMedico = async ( req, res = response )=>{
    res.json({
        ok:true,
        msg:'actualizar Medico'
    })
}

const borrarMedico = async ( req, res = response )=>{
    res.json({
        ok:true,
        msg:'borrar Medico'
    })
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
}

