// RF68 - Modificar fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF68 

const express = require('express');
const ruteador = express.Router();
const verificarToken = require('../../util/middlewareAutenticacion');

const modificarFormulaControlador = require('../controladores/modificarFormulaControlador');
const { verificarPermisos, checarPermisos } = require('../../util/middlewarePermisos');

ruteador.put(
    '/',
    verificarToken,
    verificarPermisos,
    checarPermisos('PUEDECREAR'),
    modificarFormulaControlador.modificarFormula,
);

module.exports = ruteador;