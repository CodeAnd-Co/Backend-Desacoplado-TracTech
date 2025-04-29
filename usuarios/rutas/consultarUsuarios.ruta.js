const express = require('express');
const ruteador = express.Router();
const verificarToken = require("../../util/middlewareAutenticacion");

const consultarUsuariosControlador = require('../controladores/consultarUsuarios.controlador');

ruteador.get("/", verificarToken, consultarUsuariosControlador.consultarUsuariosControlador);

module.exports = ruteador;
