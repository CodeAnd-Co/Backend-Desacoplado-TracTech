// RF71 - Eliminar una fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF71

const express = require('express');
const ruteador = express.Router();
const verificarToken = require('../../util/middlewares/middlewareAutenticacion');

const eliminarFormulaControlador = require('../controladores/eliminarFormulaControlador');
const { verificarPermisos, checarPermisos } = require('../../util/middlewares/middlewarePermisos');

ruteador.delete(
    '/', 
    verificarToken,
    verificarPermisos,
    checarPermisos('PUEDEELIMINAR'),
    eliminarFormulaControlador.eliminarFormula
);

module.exports = ruteador;