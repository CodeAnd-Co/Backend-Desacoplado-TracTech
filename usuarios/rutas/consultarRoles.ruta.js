// RF39: Administrador crea usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF39


const express = require('express');
const ruteador = express.Router();
const verificarToken = require('../../util/middlewareAutenticacion');

const consultarRolesControlador = require('../controladores/consultarRoles.controlador');
const { verificarPermisos, checarPermisos } = require('../../util/middlewarePermisos');

ruteador.get(
  '/',
  verificarToken,
  verificarPermisos,
  checarPermisos('ADMIN'),
  consultarRolesControlador.consultarRoles
);

module.exports = ruteador;