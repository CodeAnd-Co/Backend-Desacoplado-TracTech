//RF34 Usuario guarda plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF34

const express = require('express');
const ruteador = express.Router();

const guardarPlantillaControlador = require('../controladores/guardarPlantillasControlador');

ruteador.post('/', guardarPlantillaControlador.guardarPlantilla);

module.exports = ruteador;