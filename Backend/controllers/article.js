'use strict'

//importaciones
//Para validar cualquier cosa
var validator = require('validator');
var fs = require('fs');
var path = require('path');
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

    },

    getArticles: (req, res) => {

        var query = Article.find({});

        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }


        //Find pa sacar datos
        query.sort('-_id').exec((err, articles) => {
            if (err) {
                return res.status(200).send({
                    status: 'error',
                    message: 'Error al devolver los articulos'
                });
            }
            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar'
                });
            }
            return res.status(200).send({
                status: 'succes',
                articles
            });
        });

    },

    getArticle: (req, res) => {
        //Recoger el id de la url
        var articleId = req.params.id;

        //Comprobar qe existe
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo'
            });
        }
        //Buscar el articulo
        Article.findById(articleId, (err, article) => {
            if (!article || err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los datos!!!'
                });
            }

            //Devolver json
            return res.status(200).send({
                status: 'succes',
                article
            });

        });
    },

    update: (req, res) => {
        //Recoger el id del articulo por la url
        var articleId = req.params.id;
        //recoger los datos que llegan por put 
        var params = req.body;
        //Validar los datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if (validate_title && validate_content) {
            //Find and update
            Article.findOneAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar!!!'
                    });
                }

                if (!articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articuloo'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });

            });

        } else {
            //Devolver respuesta
            return res.status(200).send({
                status: 'error',
                message: 'La validación no es correcta'
            });
        }
    },

    delete: (req, res) => {
        //Recoger el id de la url
        var articleId = req.params.id;

        //Find and delete
        Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar'
                });
            }
            if (!articleRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el articulo, posiblemente no exista!!!'
                });
            }

            return res.status(200).send({
                status: 'succes',
                article: articleRemoved
            });
        });
    },

    upload: (req, res) => {
        //Configurar el modulo de connect multiparty router/article.js (hecho)

        //Recoger el fichero de la petición
        var file_name = 'Imagen no subida...';
        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }
        //Conseguir el nombre y la extensión del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        //Nombre del archivo
        var file_name = file_split[2];

        //extensión del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        //Comprobar la extensión, solo imagenes, si no es valida borrar el fichero
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            //Borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extension de la imagen no es valida'
                });
            });
        } else {
            //Si todo es valido, sacando id de la url
            var articleId = req.params.id;
            //Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
            Article.findOneAndUpdate({ _id: articleId }, { image: file_name }, { new: true }, (err, articleUpdated) => {
                if (err || !articleUpdated) {
                    return res.status(200).send({
                        status: 'error',
                        message: 'Error al guardar la imagen de articulo !!!'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            });
        }
    }, //end uppload file

    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/article/' + file;

        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(200).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });
            }
        });
    },
    search: (req, res) => {
        //Sacar el string a buscar
        var searString = req.params.search;
        //find or
        Article.find({
                //
                "$or": [
                    //Si el searchString esta incluído dentro del titulo o dentro del content sacamos los articulos que coincidan
                    { "title": { "$regex": searString, "$options": "i" } },
                    { "content": { "$regex": searString, "$options": "i" } },
                ]
            })
            //Ordenar fecha de manera descendente
            .sort([
                ['date', 'descending']
            ])
            //Sacar datos de la BD
            .exec((err, articles) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la peticion!!!'
                    });
                }
                if (!articles || articles.length <= 0) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay articulos que coincidan con tu busqueda !!'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    articles
                });
            })

    }
}; //end controller

module.exports = controller;