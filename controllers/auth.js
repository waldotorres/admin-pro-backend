const { response } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");
const { getMenuFrontEnd } = require("../helpers/menu-helper");

const login = async (req, res = response)=>{

    const { email, password } = req.body;

    try {


        const usuarioDB = await Usuario.findOne({ email });
        //verificar email
        if (!usuarioDB) {
            return res.status(400).json({
                ok:false,
                msg:'Email no encontrado'
            });
        }
        //Verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );

        if (!validPassword) {
            return res.status(400).json({
                ok:false,
                msg:'La contraseña no es valida'
            })
        }
        //Generar el token
        const token = await generarJWT(usuarioDB.id);


        res.json({
            ok:true,
            token,
            menu: getMenuFrontEnd( usuarioDB.role )
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }
}


const googleSignIn = async (req, res = response)=>{

    try {
        const {email, name, picture} = await googleVerify( req.body.token );
        let usuario ="";
        const usuarioDB = await Usuario.findOne({ email });
        
        if (!usuarioDB) {
            usuario = new Usuario({
                nombre:name,
                email,
                password:'@@@',
                img: picture,
                google:true
            });
        } else{
            usuario = usuarioDB;
            usuario.google = true;
        }

        //Guardar usuario
        await usuario.save();
        //Generar el token
        const token = await generarJWT(usuario.id);


        res.json({
            ok:true,
            email, name, picture,
            token,
            menu: getMenuFrontEnd( usuario.role )
        })

    } catch (error) {
        console.log(error);

        res.status(400).json({
            ok:false,
            msg: "Token de google no es correcto"
        })
    }

}


const renewToken = async ( req, res= response )=>{

    const uid = req.uid;
    //Generar el token
    const token = await generarJWT(uid);
    // Obtener el usuario por UID
    const usuarioDB = await Usuario.findById( uid );


    res.json({
        uid,
        ok:true,
        token,
        usuario: usuarioDB,
        menu: getMenuFrontEnd( usuarioDB.role )
    })
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}