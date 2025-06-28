//RF35 Usuario selecciona plantilla. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF35

const express = require('express');
const ruteador = express.Router();

const seleccionarPlantillaControlador = require('../controladores/seleccionarPlantillaControlador');

ruteador.post(
    '/', 
    seleccionarPlantillaControlador.seleccionarPlantilla
);

module.exports = ruteador;