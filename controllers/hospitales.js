const { response } = require("express")
const Hospital = require("../models/hospital")

const getHospitales =  async ( req, res = response )=>{

    const hospitales = await Hospital.find()
                                .populate('usuario','nombre');

    res.json({
        ok:true,
        hospitales
    })
}

const crearHospital = async ( req, res = response )=>{

    try {
    
        const hospital =  new Hospital( req.body );
        hospital.usuario = req.uid;

        await hospital.save();

        res.json({
            ok:true,
           hospital
        })

    } catch (error) {
        res.json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }
    


   
}

const actualizarHospital = async ( req, res = response )=>{
    res.json({
        ok:true,
        msg:'actualizar Hospital'
    })
}

const borrarHospital = async ( req, res = response )=>{
    res.json({
        ok:true,
        msg:'borrar Hospital'
    })
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital

}