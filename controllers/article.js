'use strict'

var controller = {
    datos: (req, resp) => {
        return resp.status(200).send({
            autor: 'Airan',
            web: 'AiranSchez.com'
        })
    },
    test: (req, resp) => {
        return resp.status(200).send({
            message: 'Soy la acción test de mi controlador'
        })
    },

    save: (req, resp) => {

        return resp.status(200).send({
            message: 'Soy la acción SAVE de mi controlador de artículos'
        })
    }
} // Fin del controlador

module.exports = controller