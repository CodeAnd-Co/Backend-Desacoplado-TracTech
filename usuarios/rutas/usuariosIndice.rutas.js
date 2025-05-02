const express = require('express');
const ruteador = express.Router();

const consultarUsuariosRuta = require("./consultarUsuarios.ruta");

/**
 * @route GET /consultar-usuarios
 * @description Redirige a rutas específicas para consultar usuarios
 * @access Según se defina en las rutas específicas
 */
ruteador.use("/consultar-usuarios", consultarUsuariosRuta);

/**
 * @route GET /
 * @description Ruta base de usuarios (solo para verificar disponibilidad)
 * @access Público
 */
ruteador.get("/", (peticion, respuesta) => {
  respuesta.sendStatus(200);
});

module.exports = ruteador;