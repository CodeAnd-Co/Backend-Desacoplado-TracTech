//RF22 Usuario guarda plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF22

const express = require('express');
const ruteador = express.Router();

const guardarPlantillaControlador = require('../controladores/guardarPlantillasControlador');

ruteador.post('/', guardarPlantillaControlador.guardarPlantilla);

module.exports = ruteador;