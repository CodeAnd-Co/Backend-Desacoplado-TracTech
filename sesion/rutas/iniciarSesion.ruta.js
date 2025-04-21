const express = require('express');
const ruteador = express.Router();

const iniciarSesionController = require("../controladores/iniciarSesion.controlador");

ruteador.post("/", iniciarSesionController.iniciarSesion);

module.exports = ruteador;
