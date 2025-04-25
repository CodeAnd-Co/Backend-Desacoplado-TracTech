const express = require('express');
const ruteador = express.Router();

const eliminarPlantillaControlador = require("../controladores/eliminarPlantillaControlador");

ruteador.post("/", eliminarPlantillaControlador.eleminiarPlantilla);

module.exports = ruteador;
