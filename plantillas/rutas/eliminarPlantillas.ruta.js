//RF33 Usuario elimina plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF33

const express = require('express');
const ruteador = express.Router();

const eliminarPlantillaControlador = require('../controladores/eliminarPlantillaControlador');

ruteador.post('/', eliminarPlantillaControlador.eliminarPlantilla);

module.exports = ruteador;