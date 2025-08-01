const express = require('express');
const ruteador = express.Router();
const verificarToken = require('../../util/middlewares/middlewareAutenticacion');

const consultarPlantillaPorIdControlador = require('../controladores/consultarPlantillaPorIdControlador');
const { verificarPermisos, checarPermisos } = require('../../util/middlewares/middlewarePermisos');

ruteador.get('/:titulo', 
    verificarToken,
    verificarPermisos,
    checarPermisos('PUEDEVER'),
    consultarPlantillaPorIdControlador.consultarPlantillaPorTitulo,);

module.exports = ruteador;
