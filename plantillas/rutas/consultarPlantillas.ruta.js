const express = require('express');
const ruteador = express.Router();

const consultarPlantillasControlador = require('../controladores/consultarPlantillasControlador');

ruteador.get('/', consultarPlantillasControlador.consultarPlantillas);

module.exports = ruteador;