const path = require('path')
const {v4: uuidv4} = require('uuid');

const subirArchivo =  (files,extensionesValidas = ['png','jpg','jpeg','gif'],carpeta = '') => {

    return new Promise((resolve,reject) => {
        const {archivo} = files;
        const fileNameSplit = archivo.name.split('.');
        const extension = fileNameSplit[fileNameSplit.length-1]
       
       
        if(!extensionesValidas.includes(extension)){
            return reject(`La extension no es valida - ${extensionesValidas}`)
        }
        
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname , '../uploads/' ,carpeta, nombreTemp);
    
        archivo.mv(uploadPath,(err) => {
            if(err){
                reject(err)
            }
    
            resolve( nombreTemp )
        })
    })
    
}

module.exports = {
    subirArchivo
}