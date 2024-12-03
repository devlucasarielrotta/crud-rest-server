const { request,response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req=request,res=response) => {
    const {correo,password} = req.body;

    const usuario = await Usuario.findOne({correo, estado:true});

    if(!usuario) {
        return res.status(400).json({
            msg:'Uno o mas datos incorrectos'
        })
    }

    const validPassword = bcryptjs.compareSync(password,usuario.password);

    if(!validPassword){
        return res.status(400).json({
            msg:'Uno o mas datos incorrectos'
        })
    }
    const token = await generarJWT(usuario.id);

    try{
        res.json({
           usuario,
           token
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            msg:'Hable con el administrador'
        })
    }
 
}

const googleSignIn = async (req,res=response) => {
    const {id_token} = req.body;
    try{
       
        const {nombre,img,correo} = await googleVerify(id_token);
        
        let usuario = await Usuario.findOne({correo});
        
        if(!usuario){
            const data = {
                nombre,
                correo,
                password: '123456',
                rol:'ADMIN_ROLE',
                img,
                google: true
            }

            usuario = await new Usuario(data);
            
            await usuario.save()
        }
       
        if(!usuario.estado){
            return res.status(401).json({
                msg:'Hable con el administrador, usuario bloqueado'
            })
        }
        
        const token = await generarJWT(usuario.id)
        
        res.json({
            usuario,
            token
        })

    }catch(error){
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo validar'
        })
    }
  
}
module.exports = {
    login,
    googleSignIn
}