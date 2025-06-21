const express = require('express');
const ruteador = express.Router();

const controladorTodasPlantillas = require('../controladores/controladorTodasPlantillas');

ruteador.get('/', controladorTodasPlantillas.consultarTodasPlantillas);

module.exports = ruteador;