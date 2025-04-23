const express = require('express');
const ruteador = express.Router();

const iniciarSesionControlador = require("../controladores/iniciarSesion.controlador");

ruteador.post("/", iniciarSesionControlador.iniciarSesion);

module.exports = ruteador;
