const express = require('express');
const ruteador = express.Router();

const consultarPlantillaCompletaControlador = require('../controladores/consultarPlantillaCompletaControlador');

ruteador.get('/', consultarPlantillaCompletaControlador.consultarPlantillaCompleta);

module.exports = ruteador;