const express = require('express');
const ruteador = express.Router();

ruteador.get("/", (pet, res) => {
    res.status(200).json({
        message: "¡Bienvenido a sesión!",
    });
});

module.exports = ruteador;