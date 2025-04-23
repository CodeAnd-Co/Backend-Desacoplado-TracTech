const express = require('express');
const ruteador = express.Router();

const consultarPlantillasControlador = require("../controladores/iniciarSesion.controlador");

ruteador.post("/", consultarPlantillasControlador.consultarPlantillas);

module.exports = ruteador;
