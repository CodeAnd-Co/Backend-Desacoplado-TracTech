//RF32 Usuario consulta plantillas de reporte. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF32

const express = require('express');
const ruteador = express.Router();

const controladorTodasPlantillas = require('../controladores/controladorTodasPlantillas');

ruteador.get('/', controladorTodasPlantillas.consultarTodasPlantillas);

module.exports = ruteador;