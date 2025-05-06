// RF67 - Guardar fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF67
// RF71 - Eliminar una fórmula - http....

const express = require('express');
const ruteador = express.Router();

const guardarFormulaRuta = require('./guardarFormula.ruta');
const eliminarFormulaRuta = require('./eliminarFormula.ruta');

ruteador.use("/guardarFormula", guardarFormulaRuta);
ruteador.use("/eliminarFormula", eliminarFormulaRuta);

ruteador.get('/', (pet, res) => {
    res.status(200).json({
        message: "¡Bienvenido a guardar formula!",
    });
});

module.exports = ruteador;