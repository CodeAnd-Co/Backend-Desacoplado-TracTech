const express = require('express');
const ruteador = express.Router();

const consultarUsuariosRuta = require("./consultarUsuarios.ruta");

ruteador.use("/consultar-usuarios", consultarUsuariosRuta);

ruteador.get("/", (peticion, respuesta) => {
    respuesta.sendStatus(200);
});

module.exports = ruteador;