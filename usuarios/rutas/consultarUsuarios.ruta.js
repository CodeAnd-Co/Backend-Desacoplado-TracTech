// RF40 Administrador consulta usuarios - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF40

const express = require('express');
const ruteador = express.Router();
const verificarToken = require('../../util/middlewares/middlewareAutenticacion');

const { consultarUsuarios: consultarUsuariosControlador } = require('../controladores/consultarUsuarios.controlador');
const { verificarPermisos, checarPermisos } = require('../../util/middlewares/middlewarePermisos');

ruteador.get(
  '/',
  verificarToken,
  verificarPermisos,
  checarPermisos('ADMIN'),
  consultarUsuariosControlador
);

module.exports = ruteador;
