const express = require('express');
const ruteador = express.Router();
const verificarToken = require("../../util/middlewareAutenticacion");

const consultarUsuariosControlador = require('../controladores/consultarUsuarios.controlador');
const { verificarPermisos, checarPermisos } = require('../../util/middlewarePermisos');

ruteador.get("/", verificarToken, verificarPermisos, checarPermisos('ADMIN'), consultarUsuariosControlador.consultarUsuariosControlador);

module.exports = ruteador;
