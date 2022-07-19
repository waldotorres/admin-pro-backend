const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


const getUsuarios = async (req = request, res = response) => {

    const desde =  Number( req.query.desde) || 0 ;

    const [ usuarios, total  ] = await Promise.all( [
        Usuario
            .find({}, 'nombre email google img')
            .skip(desde)
            .limit(5),
        Usuario.countDocuments()  //count()
    ]);

    res.json({
        ok:true,
        usuarios,
        total
    })
}

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;
    
    try {

        const existeEmail = await Usuario.findOne({ email })

        if (existeEmail) {
            return res.status(400).json({
                ok:false,
                msg:"El correo ya esta registrado"
            })
        }

        const usuario = new Usuario( req.body );
        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //Guardar usuario
        await usuario.save();
        //Generar el token
        const token = await generarJWT(usuario.id);

        res.json({
            ok:true,
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"Error inesperado... revisar logs"
        });
    }

   
}

const actualizarUsuario = async (req = request, res = response )=>{

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if (!usuarioDB) {
            return res.status(404).json({
                ok:false,
                msg:"El usuario no existe" 
            })
        }
        //TODO: Validar token y comprobar si es el usuario correcto

        //////
        const {password, google, email, ... campos} = req.body;
        
        if (usuarioDB.email !== email ) {
        
            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok:false,
                    msg:'Ya existe un usuario con ese email'
                })
            }
        }

        campos.email= email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new:true });
        
        return res.json({
            ok:true,
            usuario: usuarioActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            errors: error
        });
    }
   
    
}

const borrarUsuario = async ( req, res = response)=> {
    

    const uid = req.params.id;

    try {
        
        const usuarioDB = await Usuario.findById( uid );

        if (!usuarioDB) {
            return res.status(404).json({
                ok:false,
                msg:"El usuario no existe" 
            })
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok:true,
            msg:"Usuario eliminado"
        });

    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }
}    

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}

