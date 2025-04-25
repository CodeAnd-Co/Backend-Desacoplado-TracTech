const express = require('express');
const ruteador = express.Router();

const guardarFormulaControlador = require("../controladores/guardarFormulaControlador");

ruteador.post("/", guardarFormulaControlador.guardarFormula);

module.exports = ruteador;
