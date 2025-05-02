// RF3 Usuario cierra sesión - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF3

const { Router } = require('express');
const verificarToken = require('../../util/middlewareAutenticacion');

const cerrarSesionControlador = require('../controladores/cerrarSesion.controlador');

const ruteador = Router();

ruteador.post('/', verificarToken, cerrarSesionControlador.cerrarSesion);

module.exports = ruteador;
