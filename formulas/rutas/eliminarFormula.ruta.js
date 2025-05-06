// RF71 - Eliminar una fórmula - http....

const express = require('express');
const ruteador = express.Router();

const eliminarFormulaControlador = require('../controladores/eliminarFormulaControlador');

ruteador.delete('/', eliminarFormulaControlador.eliminarFormula);

module.exports = ruteador;