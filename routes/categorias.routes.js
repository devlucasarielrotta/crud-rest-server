const {Router} = require('express');
const {body,check,query} = require('express-validator');
const { validarJWT, validarCampos, tieneRole } = require('../middlewares');
const { crearCategoria, getCategoriaById, getCategorias, modificarCategoria, deleteCategoria } = require('../controllers/categorias.controller');
const { existeCategoriaPorId, existeCategoriaPorNombre } = require('../helpers/db-validators');
const router = Router();




router.get('/',[
    query('limite','Limite debe ser un número').optional().isNumeric(),
    query('desde','Desde debe ser un número').optional().isNumeric(),
    validarCampos
],getCategorias);

router.get('/:id',[
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],getCategoriaById);

router.post('/',[
    validarJWT,
    check('nombre','El nombre de la categoria obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria);

router.put('/:id',[
    validarJWT,
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId), 
    check('nombre','El nombre de la categoria obligatorio').not().isEmpty(),
    check('nombre').custom(existeCategoriaPorNombre),
],modificarCategoria);

router.delete('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId)
    ,validarCampos
],deleteCategoria);

module.exports = router