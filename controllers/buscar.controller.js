const {response} = require('express');
const { Usuario, Categoria, Producto } = require('../models');
const { ObjectId } = require('mongoose').Types;
const coleccionesPermitidas= [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]
const buscarUsuarios = async(termino ='',res = response) => {
    const esMongoId = ObjectId.isValid(termino);

    if(esMongoId){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }
    const regex = new RegExp(termino,'i');

    const usuarios = await Usuario.find({
        $or: [{nombre:regex}, {email: regex}],
        $and: [{estado:true}]
    });
    return res.json({
        results: (usuarios) ? [usuarios] : []
    })

}
const buscarCategorias = async(termino ='',res = response) => {
    const esMongoId = ObjectId.isValid(termino);

    if(esMongoId){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }
    const regex = new RegExp(termino,'i');

    const categorias = await Categoria.find({
        nombre:regex,estado:true
    });

    return res.json({
        results: (categorias) ? [categorias] : []
    })

}

const buscarProductos = async(termino ='',res = response) => {
    const esMongoId = ObjectId.isValid(termino);

    if(esMongoId){
        const producto = await Producto.findById(termino);
        return res.json({
            results: (producto) ? [producto] : []
        })
    }
    const regex = new RegExp(termino,'i');

    const productos = await Producto.find({
        nombre:regex,estado:true
    });

    return res.json({
        results: (productos) ? [productos] : []
    })

}


const buscar = async(req,res=response) => {

    const {coleccion,termino} = req.params;
    if(!coleccionesPermitidas.indluces(coleccion)){
        return res.status(400).json({
            msg: 	`Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch(key){
        case 'usuarios': 
            buscarUsuarios(termino,res)
        break;

        case 'categorias': 
            buscarCategorias(termino,res)
        break;     
        
        case 'productos': 
            buscarProductos(termino,res)
        break;

        default: 
            res.status(500).json({
                error: 'Not implemented colection'
            })
    }
    res.json({
        msg:'Buscar'
    })
}

module.exports = {
    buscar
}