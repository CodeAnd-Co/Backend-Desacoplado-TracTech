const express = require('express');
const ruteador = express.Router();
const verificarToken = require('../../util/middlewares/middlewareAutenticacion');

const guardarPlantillaControlador = require('../controladores/guardarPlantillaControlador');
const { verificarPermisos, checarPermisos } = require('../../util/middlewares/middlewarePermisos');

ruteador.post('/', 
    verificarToken,
    verificarPermisos,
    checarPermisos('PUEDECREAR'),
    guardarPlantillaControlador.guardarPlantilla,);

module.exports = ruteador;