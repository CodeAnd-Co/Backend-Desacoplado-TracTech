const express = require('express');
const ruteador = express.Router();

const guardarFormulaRuta = require("./guardarFormula.ruta");

ruteador.use("/guardarFormula", guardarFormulaRuta);

ruteador.get("/", (pet, res) => {
    res.status(200).json({
        message: "¡Bienvenido a guardar formula!",
    });
});

module.exports = ruteador;