// RF69 - Guardar fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF69


const express = require('express');
const ruteador = express.Router();
const verificarToken = require('../../util/middlewares/middlewareAutenticacion');

const guardarFormulaControlador = require('../controladores/guardarFormulaControlador');
const { verificarPermisos, checarPermisos } = require('../../util/middlewares/middlewarePermisos');

ruteador.post(
    '/',
    verificarToken,
    verificarPermisos,
    checarPermisos('PUEDECREAR'),
    guardarFormulaControlador.guardarFormula,
);

module.exports = ruteador;
