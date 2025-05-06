// RF43 Administrador elimina usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF43

const express = require('express');
const verificarToken = require('../../util/middlewareAutenticacion');
const { verificarPermisos, checarPermisos } = require('../../util/middlewarePermisos');
const eliminarUsuarioControlador = require('../controladores/eliminarUsuario.controlador');

const ruteador = express.Router();

ruteador.delete(
  '/:id',
  verificarToken,
  verificarPermisos,
  checarPermisos('ADMIN'),
  eliminarUsuarioControlador.eliminarUsuario
);

module.exports = ruteador;
