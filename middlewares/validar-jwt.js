const { response } = require("express");
const jwt = require("jsonwebtoken");

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

module.exports = {
    validarJWT
}