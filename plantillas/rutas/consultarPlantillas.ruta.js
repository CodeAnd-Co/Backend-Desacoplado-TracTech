const express = require('express');
const ruteador = express.Router();
const verificarToken = require('../../util/middlewares/middlewareAutenticacion');

const consultarPlantillasControlador = require('../controladores/consultarPlantillasControlador');
const { verificarPermisos, checarPermisos } = require('../../util/middlewares/middlewarePermisos');

ruteador.get('/', 
    verificarToken,
    verificarPermisos,
    checarPermisos('PUEDEVER'),
    consultarPlantillasControlador.consultarPlantillas,);

module.exports = ruteador;