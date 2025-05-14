// RF2 Usuario registrado inicia sesión - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF2

const express = require('express');
const iniciarSesionControlador = require('../controladores/iniciarSesion.controlador');
const { generarTokenCSRF } = require('../../util/generarCSRF');

const ruteador = express.Router();

ruteador.post('/', generarTokenCSRF, iniciarSesionControlador.iniciarSesion);

module.exports = ruteador;
