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
    }
} // Fin del controlador

module.exports = controller