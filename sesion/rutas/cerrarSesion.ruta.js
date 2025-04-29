// RF3 Ususario cierra sesión - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF3

const express = require('express');
const ruteador = express.Router();
const verificarToken = require("../../util/middlewareAutenticacion");

const cerrarSesionControlador = require("../controladores/cerrarSesion.controlador");

ruteador.post("/", verificarToken, cerrarSesionControlador.cerrarSesion);

module.exports = ruteador;
