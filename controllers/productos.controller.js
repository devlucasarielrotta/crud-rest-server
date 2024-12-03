const { response, request } = require("express");
const { Producto } = require("../models");


const getProductos = async(req=request,res=response) => {
    const {limite = 0,desde=0} = req.query;
    const query = {
        estado: true
    }
    const productsFind =  Producto.find(
                        query
                    )
                    .skip(+desde)
                    .limit(+limite)
                    .populate('usuario','nombre')
                    .populate('categoria');


    const totalCount =  Producto.countDocuments(
        query
    );

    const [products,total] = await Promise.all(
        [productsFind,
        totalCount]
    );

    res.status(200).json({
        total,
        products
    })
}


const getProductoById = async(req=request,res=response) => {
    const {id} = req.params;
    const query = {
        _id: id,
        estado: true
    }
    const productFind =  Producto.find(
                        query
                    )
                    .populate('usuario','nombre')
                    .populate('categoria');

 

    res.status(200).json({
        productFind
    })
}

const crearProducto = async(req,res=response) => {
    const {estado,usuario,...body} = req.body;
    const productoDB = await Producto.findOne({nombre:body.nombre});

    if(productoDB){
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        })
    }

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto =  new Producto(data);
    await producto.save();

    res.json({
        producto
    })
}

const actualizarProducto = async(req,res=response) => {

    const {id} = req.params;
    const {estado,usuario,...data} =req.body;

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id,data,{new: true});
    res.json(producto)
}

const borrarProducto = async(req,res=response) => {
    const {id} = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id,{estado:false},{new: true});

    res.json(productoBorrado)
}
module.exports = {
    getProductos,
    getProductoById,
    crearProducto,
    actualizarProducto,
    borrarProducto
}