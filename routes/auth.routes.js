const {Router} = require('express');
const {body,check,query} = require('express-validator');
const {login, googleSignIn} = require('../controllers/auth.controller');
const { emailExists } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();



router.post('/login',[
    body('correo','El correo es obligatorio').isEmail(),
    body('correo','El correo no existe').not().custom(emailExists),
    body('password','La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login);
router.post('/google',[
    check('id_token','Token de google es necesario').not().isEmpty(),
    validarCampos
],googleSignIn);

module.exports = router