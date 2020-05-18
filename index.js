'use strict'

var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/api_rest_blog"

mongoose.set("useFindAndModify", false) // Forzar que los métodos antiguos no funcionen
mongoose.Promise = global.Promise;      // Configuración que viene bien a nivel de promesas
mongoose.connect(url, {useNewUrlParser: true})
        .then(() => {
            console.log("Conexion correctaaaaaaaaaaaa")
        })