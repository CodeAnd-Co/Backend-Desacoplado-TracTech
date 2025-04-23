const express = require('express');
const ruteador = express.Router();

const iniciarSesionRuta = require("./iniciarSesion.ruta");

ruteador.use("/iniciar-sesion", iniciarSesionRuta);

ruteador.get("/", (pet, res) => {
    res.status(200).json({
        message: "¡Bienvenido a sesión!",
    });
});

module.exports = ruteador;