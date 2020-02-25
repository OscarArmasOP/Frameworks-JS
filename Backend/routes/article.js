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
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);
module.exports = router;