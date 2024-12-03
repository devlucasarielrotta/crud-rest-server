const { response, request } = require("express")
const {Categoria} = require('../models')


const getCategorias = async (req=request,res=response) => {

    const {limite = 0,desde=0} = req.query;
    const query = {
        estado:true
    }

    const categoriesFind =  Categoria.find(
                            query
                        )
                        .skip(+desde)
                        .limit(+limite)
                        .populate('usuario','nombre');

    const totalCount =  Categoria.countDocuments(
        query
    );
    const [categorias,total] = await Promise.all(
        [categoriesFind,
        totalCount]
    );

    res.json({
        
        total,
        categorias,
    })
}


const getCategoriaById = async (req=request,res=response) => {

    const {id} = req.params;

    const categoria = await Categoria.findById(id).populate('usuario','nombre')

    res.json({
        
        categoria,
    })
}

const crearCategoria = async(req,res=response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB){
        return res.status(400).json({
            msg:`La categoria ${categoriaDB.nombre} ya existe`
        })
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    await categoria.save();

    res.status(201).json(categoria);
}

const modificarCategoria = async (req=request,res=response) => {
    const {id} = req.params;
    const nombre = req.body.nombre.toUpperCase().trim();

    const categoriaDB = await Categoria.findByIdAndUpdate(id,nombre);
    res.json({
       
        categoriaDB
    })
}

const deleteCategoria = async (req=request,res=response) => {
    const {id} = req.params;
   

    const categoria = await Categoria.findByIdAndUpdate(id, {
        estado: false   
    }) 

    const usuarioAutenticado= req.usuario;

    res.json({
        categoria,
        usuarioAutenticado
    })
}

const putCategoria = async (req=request,res=response) => {
    const {id} = req.params;
    
    const {estado,usuario,...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    
    const query = {
        _id: id,
        estado:true
    }

    const categoriaFind =  await Categoria.findByIdAndUpdate(
                           query,data
                        )

 

    categoriaFind
    res.json({
        categoriaFind
    })
}

module.exports = {
    crearCategoria,
    getCategorias,
    getCategoriaById,
    modificarCategoria,
    deleteCategoria,
    putCategoria
}