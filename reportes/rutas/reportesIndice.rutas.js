const express = require('express');
const ruteador = express.Router();

ruteador.get("/", (pet, res) => {
    res.status(200).json({
        message: "¡Bienvenido a reportes!",
    });
});

module.exports = ruteador;