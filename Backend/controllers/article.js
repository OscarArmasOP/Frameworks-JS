'use strict'

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
    }

}; //end controller

module.exports = controller;