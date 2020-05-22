"use strict";

var validator = require("validator");
var Article = require("../models/article");
var fs = require("fs");
var path = require("path");

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
      return errorFunction(404, resp, "Faltan datos por enviar");
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
          return errorFunction(404, resp, "el articulo no se ha guardado");
        } else {
          return successFunction(resp, "artículo guardado", articleStored);
        }
      });

      // Devolver una respuesta
      return successFunction(resp, "exito", params);
    } else {
      // Crear el objeto a guardar

      // Asignar valores

      // Guardar el artículo

      // Devolver una respuesta
      return errorFunction(404, resp, "Los datos no son validos");
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
      if (!articles || err) {
        return errorFunction(
          404,
          resp,
          "No hay artículos para mostrar o no existen"
        );
      }

      return successFunction(resp, "Aqui tienes tus artículos", articles);
    });
  },

  getArticle: (req, resp) => {
    // Recoger id de la URL
    var articleId = req.params.id;
    // Comprobar si existe
    if (!articleId || articleId == null) {
      return errorFunction(404, resp, "No existe artículo");
    }
    // Buscar artículo
    Article.findById(articleId, (err, article) => {
      if (!articleId || err) {
        return errorFunction(404, resp, "No se ha encontrado ningún artículo");
      }

      // Devolverlo en json
      return successFunction(resp, "Exito", article);
    });
  },

  update: (req, resp) => {
    // Recoger id del artículo por la url
    var articleId = req.params.id;
    // Recoger los datos que llegan por put
    var params = req.body;
    // validar datos

    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
    } catch (err) {
      return errorFunction(404, resp, "Faltan datos por enviar!");
    }

    if (validate_title && validate_content) {
      // find and update
      Article.findOneAndUpdate(
        { _id: articleId },
        params,
        { new: true },
        (err, articleUpdated) => {
          if (err) {
            return errorFunction(500, resp, " Error al actualizar");
          }

          if (!articleUpdated) {
            return errorFunction(404, resp, "No existe artículo");
          }

          return successFunction(resp, "Put ha sido un éxito", articleUpdated);
        }
      );
    } else {
      //Devolver respuesta
      return errorFunction(500, resp, "Error");
    }
  },
  delete: (req, resp) => {
    // Recoger el id de la url
    var articleId = req.params.id;

    // Find and delte
    Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
      if (err) {
        return errorFunction(500, resp, "Error al borrar");
      }

      if (!articleRemoved) {
        return errorFunction(
          404,
          resp,
          "No se ha borrado el articulo, posiblemente no existe"
        );
      }

      return successFunction(resp, "Articulo borrado", articleRemoved);
    });
  },

  upload: (req, resp) => {
    //Configurar el modulo del connect multiparty

    // Recoger el fichero
    var file_name = "imagen no subida...";

    if (!req.files) {
      return errorFunction(404, resp, file_name);
    }

    // Conseguir el nombre y la extensión

    var file_path = req.files.file0.path;
    var file_split = file_path.split("\\");

    var file_name = file_split[2];
    var extension_split = file_name.split(".");
    var file_ext = extension_split[1];
    // Comprobar la extensión, solo imagenes, si no es valida borrar el fichero

    if (
      file_ext != "png" &&
      file_ext != "jpg" &&
      file_ext != "jpeg" &&
      file_ext != "gif"
    ) {
      // Borrar archivo
      fs.unlink(file_path, (err) => {
        return errorFunction(
          200,
          resp,
          "La extension de la imagen no es valida"
        );
      });
    } else {
      // Buscar archivo
      var articleId = req.params.id;
      Article.findOneAndUpdate(
        { _id: articleId },
        { image: file_name },
        { new: true },
        (err, articleUpdated) => {
          if (err || !articleUpdated) {
            return errorFunction(
              200,
              resp,
              "Error al guardar la imagen del artículo"
            );
          }

          return successFunction(resp, "Success", articleUpdated);
        }
      );
    }
  },

  getImage: (req, resp) => {
    var file = req.params.image;
    var path_file = "./upload/articles/" + file;

    fs.exists(path_file, (exists) => {
      if (exists) {
        return resp.sendFile(path.resolve(path_file));
      } else {
        return errorFunction(404, resp, "La imagen noo existe");
      }
    });
  },

  search: (req, resp) => {
    // Sacar el string a buscar
    var searchString = req.params.search;
    // Find or
    Article.find({
      $or: [
        { title: { $regex: searchString, $options: "i" } },
        { content: { $regex: searchString, $options: "i" } },
      ],
    })
      .sort([["date", "descending"]])
      .exec((err, articles) => {
        if (err || !articles || articles.length <= 0) {
          return errorFunction(404, resp, "Articulos noo encontrados");
        }
        return successFunction(resp, "Articulos encontrados", articles);
      });
  },
}; // Fin del controlador

module.exports = controller;

function successFunction(resp, msg, object) {
  return resp.status(200).send({
    status: "Success",
    message: msg,
    article: object,
  });
}

// Funciones comunes
function errorFunction(error, resp, msg) {
  return resp.status(error).send({
    status: "error",
    message: msg,
  });
}
