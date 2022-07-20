/*

Ruta: /api/medicos

*/


const { check } = require('express-validator')
const { Router } = require('express');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos');

const router = Router();

router.get('/',  getMedicos );

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es necesario').not().isEmpty(),
    check('hospital', 'Debe ser valido').isMongoId(),
    validarCampos
], crearMedico );

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es necesario').not().isEmpty(),
    check('hospital', 'Debe ser valido').isMongoId(),
    validarCampos,
], actualizarMedico );


router.delete('/:id', [
    validarJWT
], borrarMedico )


module.exports = router;



