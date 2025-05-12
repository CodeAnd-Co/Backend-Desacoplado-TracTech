// RF69 - Guardar fórmula - http...

const express = require('express');
const ruteador = express.Router();
const verificarToken = require('../../util/middlewareAutenticacion');

const consultarFormulasControlador = require('../controladores/consultarFormulaControlador');
const { verificarPermisos, checarPermisos } = require('../../util/middlewarePermisos');

ruteador.get('/', 
    verificarToken,
    verificarPermisos,
    checarPermisos('PUEDEVER'),
    consultarFormulasControlador.consultarFormula,);

module.exports = ruteador;
