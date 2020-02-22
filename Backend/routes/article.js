'use strict'

var express = require('express');
var ArticleController = require('../controllers/article');

//llamar al router

var router = express.Router();
//Rutas de prueba
//Crear ruta por get
router.get('/datos-curso', ArticleController.datosCurso);
router.get('/test-de-controllador', ArticleController.test);

//Rutas  utiles
router.post('/save', ArticleController.save);


module.exports = router;