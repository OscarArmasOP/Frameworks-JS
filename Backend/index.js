'use strict'

///Cargar modulo de mongoose
var mongoose = require('mongoose');

// Cargar archivo app
var app = require('./app');
var port = 3900;

///Desactivar forma antigua de trabajo
mongoose.set('useFindAndModify', false);

///Uso de promesas para evitar fallos con MongoDB
mongoose.Promise = global.Promise;
///Conexión a MongoDB 
mongoose.connect('mongodb://localhost:27017/api_rest_blog', { useNewUrlParser: true })
    .then(() => {
        console.log('La conexion a la base de datos se ha dado gud  bien!!');

        //Crear servidor y escuchar peticiones HTTP
        app.listen(port, () => {
            console.log('Servidor corriendo en http://localhost: ' + port);
        });

    });