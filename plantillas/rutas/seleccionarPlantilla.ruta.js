const express = require('express');
const ruteador = express.Router();

const seleccionarPlantillaControlador = require('../controladores/seleccionarPlantillaControlador');

ruteador.post('/', seleccionarPlantillaControlador.seleccionarPlantilla);

module.exports = ruteador;