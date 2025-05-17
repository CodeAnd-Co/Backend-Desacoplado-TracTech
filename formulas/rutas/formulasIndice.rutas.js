// RF69 - Guardar fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF69
// RF71 - Eliminar una fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF71
// RF68 - Modificar fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF68 
// RF76 - Consultar fórmulas - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF76


const express = require('express');
const ruteador = express.Router();

const guardarFormulaRuta = require('./guardarFormula.ruta');
const eliminarFormulaRuta = require('./eliminarFormula.ruta');
const consultarFormulasRuta = require('./consultarFormulas.ruta');
const modificarFormulaRuta = require('./modificarFormula.ruta');

ruteador.use('/guardarFormula', guardarFormulaRuta);
ruteador.use('/eliminarFormula', eliminarFormulaRuta);
ruteador.use('/consultarFormulas', consultarFormulasRuta);
ruteador.use('/modificarFormula', modificarFormulaRuta);


module.exports = ruteador;