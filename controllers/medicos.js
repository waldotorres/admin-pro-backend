const { response, request } = require("express");
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


const getMedicoById = async ( req, res = response )=>{

    const id = req.params.id;

    try {

        const medico = await Medico.findById( id )
        .populate('hospital', 'nombre')
        .populate('usuario', 'nombre');

        res.json({
        ok:true,
        medico
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok:false,
            msg:'Hable con el administrador'
            })

    }

    
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

    try {
        const uid = req.uid; 
        const id = req.params.id;
        const medico =  await Medico.findById(id);

        if( !medico ){
            return res.status(400).json({
                ok:false,
                msg:"El medico no existe"
            });
        }
    
        const medicoUPD =  {
            ...req.body,
            usuario:uid,

        }

        const medicoMDF = await Medico.findByIdAndUpdate(id, medicoUPD, {new:true})
    
        res.json({
            ok:true,
            medico:medicoMDF
        })    
    } catch (error) {
        
        console.log(error);

        res.status(500).json({
            ok:false,
            msg:"Hable con el administrador"
    
        })  
    }
    
}

const borrarMedico = async ( req, res = response )=>{

    try {
        const id = req.params.id;
        const medico =  await Medico.findById(id);
        
        if( !medico ){
            return res.status(400).json({
                ok:false,
                msg:"El medico no existe"
            });
        }

        await medico.delete();

        res.json({
            ok:true,
            msg:'Medico borrado'
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
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById
}

