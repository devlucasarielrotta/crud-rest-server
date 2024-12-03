const {Router} = require('express');
const {body,check,query} = require('express-validator');

// const { validarCampos } = require('../middlewares/validar-campos');
const { esRoleValido, emailExists, existeUsuarioPorId } = require('../helpers/db-validators');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-role');
const {esAdminRole,tieneRole,validarCampos,validarJWT} = require('../middlewares');
const { getUsers, putUsers, postUsers, deleteUsers, getUserById } = require('../controllers/user.controller');


const router = Router();

router.get('/',[
    query('limite','Limite debe ser un número').optional().isNumeric(),
    query('desde','Desde debe ser un número').optional().isNumeric(),
    validarCampos
],getUsers);

router.get('/:id',[
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
],getUserById);

router.post('/',[
    body('nombre','El nombre es obligatorio').not().isEmpty(),
    body('password','El password debe ser más de 6 letras').isLength({min:6}),
    body('correo','El correo no es válido').isEmail(),
    body('correo').custom(emailExists),
    // body('rol','No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    body('rol').custom( esRoleValido ),
    validarCampos,
],postUsers)

router.put('/:id',[
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    body('rol').optional().custom( esRoleValido ),
    body('correo','El correo no es válido').optional().isEmail(),
    body('correo').optional().custom( emailExists ),
    body('nombre','El nombre es obligatorio').optional().not().isEmpty(),
    body('password','El password debe ser más de 6 letras').optional().isLength({min:6}),
    validarCampos
],putUsers)

router.delete('/:id',[
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
],deleteUsers)

module.exports = router;
