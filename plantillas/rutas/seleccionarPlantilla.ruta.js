//RF23 Usuario consulta plantillas de reporte. - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF23

const express = require('express');
const ruteador = express.Router();

const seleccionarPlantillaControlador = require("../controladores/seleccionarPlantillaControlador");

ruteador.post("/", seleccionarPlantillaControlador.seleccionarPlantilla);

module.exports = ruteador;
