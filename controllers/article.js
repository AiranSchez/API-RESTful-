"use strict";

var validator = require("validator");
var Article = require("../models/article");

var controller = {
  datos: (req, resp) => {
    return resp.status(200).send({
      autor: "Airan",
      web: "AiranSchez.com",
    });
  },
  test: (req, resp) => {
    return resp.status(200).send({
      message: "Soy la acción test de mi controlador",
    });
  },

  save: (req, resp) => {
    // Recoger parametros por post
    var params = req.body;

    // Validar datos (validator)
    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
    } catch (err) {
      return resp.status(200).send({
        status: "error",
        message: "Faltan datos por enviar",
      });
    }

    if (validate_content && validate_title) {
      // Crear el objeto a guardar
      var article = new Article();

      // Asignar valores
      article.title = params.title;
      article.content = params.content;
      article.image = null;
      // Guardar el artículo
      article.save((error, articleStored) => {
        if (error || !articleStored) {
          return resp.status(200).send({
            status: "error",
            message: "el articulo no se ha guardado",
          });
        } else {
          return resp.status(200).send({
            status: "Success",
            article: articleStored,
          });
        }
      });

      // Devolver una respuesta
      return resp.status(200).send({
        status: "Success",
        article: params,
      });
    } else {
      // Crear el objeto a guardar

      // Asignar valores

      // Guardar el artículo

      // Devolver una respuesta
      return resp.status(200).send({
        status: "error",
        message: "Los datos no son validos",
      });
    }
  },

  getArticles: (req, resp) => {
    var query = Article.find({});
    var last = req.params.last;

    if (last || last != undefined) {
      query.limit(5);
    }
    // Find
    query.sort("-_id").exec((err, articles) => {
      if (err) {
        return resp.status(200).send({
          status: "error",
          message: "Error al devolver los artículos",
        });
      }

      if (!articles) {
        return resp.status(200).send({
          status: "error",
          message: "No hay artículos para mostrar",
        });
      }

      return resp.status(200).send({
        status: "Success",
        message: "Aqui tienes tus artículos",
        articles,
      });
    });
  },

  getArticle: (req, resp) => {
    // Recoger id de la URL
    var articleId = req.params.id;
    // Comprobar si existe
    if (!articleId || articleId == null) {
      return resp.status(404).send({
        status: "error",
        message: "No hay artículo",
      });
    }
    // Buscar artículo
    Article.findById(articleId, (err, article) => {
      if (err) {
        return resp.status(500).send({
          status: "error",
          message: "Error al devolver artículo",
        });
      }

      if (!articleId) {
        return resp.status(404).send({
          status: "error",
          message: "No existe artículo",
        });
      }

      // Devolverlo en json
      return resp.status(200).send({
        status: "success",
        message: "Exito",
        article,
      });
    });
  },
}; // Fin del controlador

module.exports = controller;
