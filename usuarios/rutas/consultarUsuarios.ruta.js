const express = require('express');
const ruteador = express.Router();

const consultarUsuariosControlador = require('../controladores/consultarUsuarios.controlador');

ruteador.get("/", consultarUsuariosControlador.consultarUsuariosControlador);

module.exports = ruteador;
