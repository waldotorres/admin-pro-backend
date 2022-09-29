/****
 Ruta: /api/usuarios
 ****/

const { check } = require('express-validator')
const { Router } = require('express');
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuario');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getUsuarios );

router.post('/', [
    
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos,
], crearUsuario );

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('role','El rol esobligatorio').not().isEmpty(),
    validarCampos,
], actualizarUsuario );


router.delete('/:id', [
    validarJWT
], borrarUsuario )


module.exports = router;