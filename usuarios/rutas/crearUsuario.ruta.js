// RF39: Administrador crea usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF39

const express = require('express');
const ruteador = express.Router();
const verificarToken = require('../../util/middlewareAutenticacion');

const crearUsuarioControlador = require('../controladores/crearUsuario.controlador');
const { verificarPermisos, checarPermisos } = require('../../util/middlewarePermisos');

ruteador.post(
  '/',
  verificarToken,
  verificarPermisos,
  checarPermisos('ADMIN'),
  crearUsuarioControlador.crearUsuarioControlador
);

module.exports = ruteador;
