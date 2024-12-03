const {request,response} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const getUserById = async(req=request,res=response) => {
    const {id} = req.params;
    
    const query = {
        _id: id,
        estado:true
    }

    const userFind =  await Usuario.findById(
                           query
                        )

    res.json({
        userFind
    })
}

const getUsers = async (req = request,res = response) => {

    const {limite = 0,desde=0} = req.query;
    const query = {
        estado:true
    }

    const usersFind =  Usuario.find(
                            query
                        )
                        .skip(+desde)
                        .limit(+limite);

    const totalCount =  Usuario.countDocuments(
        query
    );
    const [users,total] = await Promise.all(
        [usersFind,
        totalCount]
    );

    res.json({
        
        total,
        users,
    })
}

const postUsers = async (req = request,res = response) => {
  
    const {nombre,correo,password,rol} = req.body;
    
    const usuario = new Usuario({
        nombre,correo,password,rol
    });

    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password,salt);

    await usuario.save();

    res.json({
        msg:'Post api',
        usuario,
    })
}

const putUsers = async(req=request,res = response) => {
    const {id} = req.params;

    const {password,google,_id,...usuario} = req.body;

    if(password){
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password,salt);
    }

    const usuarioDB = await Usuario.findByIdAndUpdate(id,usuario);
    res.json({
        msg:'Put api',
        usuarioDB
    })
}

const deleteUsers = async (req=request,res = response) => {
    const {id} = req.params;

    const usuario = await Usuario.findByIdAndUpdate(id, {
        estado: false   
    }) 

    const usuarioAutenticado= req.usuario;

    res.json({
        usuario,
        usuarioAutenticado
    })
}

module.exports= {
    getUsers,
    getUserById,
    postUsers,
    putUsers,
    deleteUsers
}