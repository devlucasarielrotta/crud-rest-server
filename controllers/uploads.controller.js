const { response } = require('express');
const path = require('path')
const cloudinary = require('cloudinary').v2
cloudinary.config(procces.env.CLOUDINARY_URL);
const {subirArchivo} = require('../helpers/subir-archivo');
const { Usuario, Producto } = require('../models');
const { model } = require('mongoose');
const fs = require('fs');


const cargarArchivo = async (req,res =response) => {
    
  
    if(!req.files.archivo){
        res.status(400).json({
            msg:' No hay archivos que subir'
        })

        return;
    }

    try{
        const nombre = await subirArchivo(req.files,undefined,'nueva');

        res.json({
           nombre
        })
    
    }catch(error){
        res.status(400).json({
            error: error.message
        })
    }
   
}

const actualizarImagen = async( req,res=response) => {
 
    const {id,coleccion} = req.params;    
    let modelo; 

    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
                modelo = await Producto.findById(id);
    
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe un producto con el id ${id}`
                    })
                }
                break;

        default:
            return res.status(500).json({
                msg: 'Not implemented yet'
            })
    }
    
    if(modelo.img){
        const pathImagen = path.join(__dirname , '../uploads',coleccion,modelo.img);

        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files,undefined,coleccion);
    modelo.img = nombre;
    await modelo.save()
    res.json({id,coleccion})
}

const actualizarImagenCloudinary = async( req,res=response) => {
 
    const {id,coleccion} = req.params;    
    let modelo; 

    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
                modelo = await Producto.findById(id);
    
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe un producto con el id ${id}`
                    })
                }
                break;

        default:
            return res.status(500).json({
                msg: 'Not implemented yet'
            })
    }
    
    if(modelo.img){
        const nombreArr = modelo.img.split('/');
        const nombre    = nombreArr[nombreArr.length - 1];

        const [ public_id] = nombre.split('.');

        await cloudinary.uploader.destroy(public_id)
    }
    const {tempFilePath} = req.files.archivo
    const {secure_url}   = await cloudinary.uploader.upload(tempFilePath)
    modelo.img = secure_url;
    await modelo.save()
    res.json({id,coleccion})
}
const mostrarImagen = async(req,res = response) => {
   
   
    const {id,coleccion} = req.params;    
    let modelo; 

    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
                modelo = await Producto.findById(id);
    
                if(!modelo){
                    return res.status(400).json({
                        msg: `No existe un producto con el id ${id}`
                    })
                }
                break;

        default:
            return res.status(500).json({
                msg: 'Not implemented yet'
            })
    }
    
    if(modelo.img){
        const pathImagen = path.join(__dirname , '../uploads',coleccion,modelo.img);

        if(fs.existsSync(pathImagen)){
            return res.sendFile(pathImagen)
        }
    }
    const pathImagen = path.join(__dirname,'../assets/no-image.jpg');

    res.sendFile(pathImagen)
}
module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}