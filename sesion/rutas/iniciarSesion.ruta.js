// RF2 Usuario registrado inicia sesión - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF2

const express = require('express');
const ruteador = express.Router();

const iniciarSesionControlador = require("../controladores/iniciarSesion.controlador");

ruteador.post("/", iniciarSesionControlador.iniciarSesion);

module.exports = ruteador;
