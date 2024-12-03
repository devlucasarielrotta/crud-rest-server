const { response, request } = require('express');

const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');

const validarJWT = async (req=request,res=response,next) => {
    const token = req.header('x-token');

    if(!token){
        res.status(401).json({
            msg:'Token no informado'
        })
    }

    try{

        const {uid} = jwt.verify(token,process.env.SECRETORPRIVATEKEY);
        const usuarioAutenticado = await Usuario.findById(uid);

        if(!usuarioAutenticado){
            res.status(401).json({
                msg:'Usuario inexistente'
            })
        }

        if(!usuarioAutenticado.estado){
            res.status(401).json({
                msg:'Usuario dado de baja'
            })
        }
   
        req.usuario = usuarioAutenticado;
      

        next();
    }catch(error){
        console.log(error);
        res.status(401).json({
            msg:'Toke no válido'
        })
    }

}

module.exports = {
    validarJWT
}