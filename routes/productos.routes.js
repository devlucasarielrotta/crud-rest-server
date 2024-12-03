const {Router} = require('express');
const {body,check,query} = require('express-validator');
const { validarJWT, validarCampos, tieneRole, esAdminRole } = require('../middlewares');

const {  existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { getProductos, borrarProducto, crearProducto, actualizarProducto, getProductoById } = require('../controllers/productos.controller');
const router = Router();




router.get('/',[
    query('limite','Limite debe ser un número').optional().isNumeric(),
    query('desde','Desde debe ser un número').optional().isNumeric(),
    validarCampos
],getProductos);

router.get('/:id',[
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],getProductoById);

router.post('/',[
    validarJWT,
    check('nombre','El nombre de la categoria obligatorio').not().isEmpty(),
    check('categoria','La categoria es obligatorio').not().isEmpty(),
    check('categoria','No es un mongoID').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
],crearProducto);

router.put('/:id',[
    validarJWT,
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    check('nombre','El nombre del producto no debe ser vacio').optional().not().isEmpty(),
],actualizarProducto);

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId)
    ,validarCampos
],borrarProducto);

module.exports = router