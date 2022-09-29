const { response } = require("express");
const jwt = require("jsonwebtoken");
const usuario= require('../models/usuario');


const validarJWT = (req, res = response, next)=>{
    //Leer token
    const token = req.header('x-token');

    if (!token) {
        res.status(401).json({
            ok:false,
            msg:'No hay token en la peticion'
        })
    }

    try {
        
        const { uid } = jwt.verify( token, process.env.JWT_SECRET );
        req.uid = uid;
        next();

    } catch (error) {
        return res.status(401).json({
            ok:false,
            msg:'token incorrecto'
        })
    }

    
}


const validarAdminRole = async (req, res, next)=>{

    const uid = req.uid;


    try {
        
        const usuarioDB = await usuario.findById(uid);
        
        if(!usuarioDB){
          return  res.status(404).json({
                ok:false,
                msg:'Usuario no existe'
            })
        }

        if(usuarioDB.role !== 'ADMIN_ROLE'){

            return res.status(403).json({
                ok:false,
                msg:'Usuario no es administrador'
            })
        }


        next();

    } catch (error) {
        
        console.log(error);

        res.status(500).json({
            ok:false, 
            msg:'Hable con el administrador'
        })

    }

}


const validarAdminRole_MismoUsuario = async (req, res, next)=>{

    const id = req.params.id;
    const uid = req.uid;

    console.log(uid);
    console.log(id)

    try {
        
        const usuarioDB = await usuario.findById(uid);
        
        if(!usuarioDB){
          return  res.status(404).json({
                ok:false,
                msg:'Usuario no existe'
            })
        }



        if( usuarioDB.role === 'ADMIN_ROLE' || uid === id ){

            next();

        }
        else{
            return res.status(403).json({
                ok:false,
                msg:'Usuario no es administrador'
            })
        }




    } catch (error) {
        
        console.log(error);

        res.status(500).json({
            ok:false, 
            msg:'Hable con el administrador'
        })

    }

}

module.exports = {
    validarJWT,
    validarAdminRole,
    validarAdminRole_MismoUsuario
}