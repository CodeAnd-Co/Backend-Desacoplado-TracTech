const express = require('express');
const ruteador = express.Router();
const verificarToken = require("../../util/middlewareAutenticacion");

const consultarUsuariosControlador = require('../controladores/consultarUsuarios.controlador');
const { verificarPermisos, checarPermisos } = require('../../util/middlewarePermisos');

/**
 * @route GET /
 * @description Consulta todos los usuarios, requiere autenticación y permiso ADMIN
 * @access Privado - Solo usuarios con rol ADMIN pueden acceder
 */
ruteador.get(
  "/",
  verificarToken,
  verificarPermisos,
  checarPermisos('ADMIN'),
  consultarUsuariosControlador.consultarUsuariosControlador
);

module.exports = ruteador;
