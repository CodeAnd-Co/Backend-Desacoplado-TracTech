// Archivo: consultarTodasPlantillas.ruta.js
const express = require('express');
const ruteador = express.Router();

const consultarTodasPlantillasControlador = require('../controladores/controladorTodasPlantillas');

ruteador.get('/', consultarTodasPlantillasControlador.consultarTodasPlantillas);

module.exports = ruteador;