'use strict'

var express = require('express');
var ArticleController = require('../controllers/article');

//llamar al router

var router = express.Router();
//Crear ruta por get
router.get('/datos-curso', ArticleController.datosCurso);
router.get('/test-de-controllador', ArticleController.test);

module.exports = router;