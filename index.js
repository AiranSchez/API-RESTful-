'use strict'

var mongoose = require('mongoose');
var app = require('./app')
var port = 3900

mongoose.set("useFindAndModify", false) // Forzar que los métodos antiguos no funcionen
mongoose.Promise = global.Promise;      // Configuración que viene bien a nivel de promesas

mongoose.connect('mongodb://localhost:27017/api_rest_blog', {useNewUrlParser: true})
        .then(() => {
            console.log("Conexion correcta")

            // Crear servidor y ponerme a escuchar peticiones http
            app.listen(port, () => {
                console.log("Servidor corriendo en http://localhost:" + port)
            })
        })