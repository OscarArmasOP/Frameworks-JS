'use strict'

//importaciones
//Para validar cualquier cosa
var validator = require('validator');
var Article = require('../models/article');

var controller = {
    datosCurso: (req, res) => {
        //Devolver datos como JSON
        return res.status(200).send({
            curso: 'Frameworks en JS',
            nombre: 'Oscar Martinez'
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la accion test de mi controlador de articulos'
        })
    },

    save: (req, res) => {
        //Recoger parametros por post
        var params = req.body;


        //Validar datos (validator)
        try {
            //variable verdadera cuando no  este vacio params tittle y content
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar!!!'
            });
        }

        if (validate_title && validate_content) {
            //Crear el objeto a guardar
            //intancia del modelo
            var article = new Article();

            //Asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;

            //Guardar el articulo
            article.save((err, articleStored) => {

                if (err || !articleStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No se ha guardado el articulo!!!'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });

            });
            //Devolver respuesta

            //prueba
            return res.status(200).send({
                status: 'success',
                article
            });
        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos!!!'
            });
        }

    }

}; //end controller

module.exports = controller;