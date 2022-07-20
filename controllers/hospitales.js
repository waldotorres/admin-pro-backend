const { response, request } = require("express")
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

const actualizarHospital = async ( req = request, res = response )=>{
    

    try {
        const uid = req.uid; 
        const id = req.params.id;
        const hospital =  await Hospital.findById(id);

        if( !hospital ){
            return res.status(400).json({
                ok:false,
                msg:"El hospital no existe"
            });
        }
    
        const hospitalUPD =  {
            ...req.body,
            usuario:uid,

        }

        const hospitalMDF = await Hospital.findByIdAndUpdate(id, hospitalUPD, {new:true})
    
        res.json({
            ok:true,
            hospital:hospitalMDF
    
        })    
    } catch (error) {
        
        console.log(error);

        res.status(500).json({
            ok:false,
            msg:"Consulte con el administrador"
    
        })  
    }
    
}

const borrarHospital = async ( req = request, res = response )=>{

    try {
        const id = req.params.id;
        const hospital =  await Hospital.findById(id);
        
        if( !hospital ){
            return res.status(400).json({
                ok:false,
                msg:"El hospital no existe"
            });
        }

        await hospital.delete();

        res.json({
            ok:true,
            msg:'Hospital borrado'
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }

    
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital

}