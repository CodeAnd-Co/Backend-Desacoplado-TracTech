// RF67 - Guardar fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF67

const express = require('express');
const ruteador = express.Router();

const guardarFormulaControlador = require("../controladores/guardarFormulaControlador");

ruteador.post("/", guardarFormulaControlador.guardarFormula);

module.exports = ruteador;
