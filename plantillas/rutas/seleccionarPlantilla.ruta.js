const express = require('express');
const ruteador = express.Router();

const seleccionarPlantillaControlador = require("../controladores/seleccionarPlantillaControlador");

ruteador.get("/:idPlantillaReporte", seleccionarPlantillaControlador.seleccionarPlantilla);

module.exports = ruteador;
