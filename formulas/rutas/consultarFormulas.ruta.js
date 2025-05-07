// RF69 - Guardar fórmula - http...

const express = require('express');
const ruteador = express.Router();

const consultarFormulasControlador = require('../controladores/consultarFormulaControlador');

ruteador.get('/', consultarFormulasControlador.consultarFormula);

module.exports = ruteador;
