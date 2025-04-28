//RF21 Usuario elimina plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF21

const express = require('express');
const ruteador = express.Router();

const eliminarPlantillaControlador = require("../controladores/eliminarPlantillaControlador");

ruteador.post("/", eliminarPlantillaControlador.eleminiarPlantilla);

module.exports = ruteador;
