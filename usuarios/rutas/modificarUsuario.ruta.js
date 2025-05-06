// RF41 Administrador modifica usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF41

const express = require('express');
const ruteador = express.Router();
const verificarToken = require('../../util/middlewareAutenticacion');

const { modificarUsuario: modificarUsuarioControlador } = require('../controladores/modificarUsuario.controlador');
const { verificarPermisos, checarPermisos } = require('../../util/middlewarePermisos');

ruteador.put(
  '/',
  verificarToken,
  verificarPermisos,
  checarPermisos('ADMIN'),
  modificarUsuarioControlador
);

module.exports = ruteador;
