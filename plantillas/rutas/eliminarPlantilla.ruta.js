const express = require('express');
const ruteador = express.Router();
const verificarToken = require('../../util/middlewares/middlewareAutenticacion');

const eliminarPlantillaControlador = require('../controladores/eliminarPlantillaControlador');
const { verificarPermisos, checarPermisos } = require('../../util/middlewares/middlewarePermisos');

ruteador.delete('/:id', 
    verificarToken,
    verificarPermisos,
    checarPermisos('PUEDEELIMINAR'),
    eliminarPlantillaControlador.eliminarPlantilla,);

module.exports = ruteador;