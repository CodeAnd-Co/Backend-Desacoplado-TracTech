//RF23 Usuario consulta plantillas de reporte completas - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF23

const express = require('express');
const ruteador = express.Router();

const consultarPlantillaCompletaControlador = require('../controladores/consultarPlantillaCompletaControlador');

ruteador.post('/', consultarPlantillaCompletaControlador.consultarPlantillaCompleta);

module.exports = ruteador;