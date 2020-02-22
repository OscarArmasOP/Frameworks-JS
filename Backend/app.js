'use strict'

// Cargar modulos de node para crear servidor con express
var express = require('express');
var bodyParser = require('body-parser');

// Ejecutar express para trabajar con (http)
var app = express();

// Cargar ficheros rutas
var article_routes = require('./routes/article');


// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS (para peticiones de front)

// Añadir prefijos a rutas / Cargar rutas
app.use('/api', article_routes);


// Exportar modulo (fichero actual)
module.exports = app;