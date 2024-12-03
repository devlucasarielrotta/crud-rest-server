const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload')
const { dbConnection } = require('../database/config');

class Server {

    constructor(){

        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            usuarios:   '/api/users',
            categories: '/api/categories',
            productos:  '/api/products',
            uploads:    '/api/uploads'
        }
        // this.usuariosPath = '/api/users';
        // this.categoryPath = '/api/categories';
        // this.authPath     = '/api/auth';
        this.conectarDB();

        // middlewares
        this.middlewares();

        this.routes();
    }

    middlewares(){
        this.app.use(express.static('public'))
        this.app.use(cors());
        this.app.use(express.json());

        this.app.use(fileUpload({
            useTempFiles:true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }))
    }

    routes(){
       this.app.use(this.paths.auth,require('../routes/auth.routes.js'))
       this.app.use(this.paths.categories ,require('../routes/categorias.routes.js'))
       this.app.use(this.paths.usuarios ,require('../routes/user.routes'))
       this.app.use(this.paths.productos ,require('../routes/productos.routes.js'))
       this.app.use(this.paths.buscar ,require('../routes/buscar.routes.js'))
       this.app.use(this.paths.uploads ,require('../routes/uploads.routes.js'))
    }

    listen(){
        this.app.listen(this.port,() => {
            console.log('Servidor corriendo en http://localhost:'+this.port)
        });
    }

    async conectarDB (){
        await dbConnection();
    }
}

module.exports = Server;