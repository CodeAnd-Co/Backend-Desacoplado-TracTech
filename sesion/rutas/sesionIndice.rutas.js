const express = require('express');
const ruteador = express.Router();

const iniciarSesionRoute = require("./iniciarSesion.ruta");

ruteador.use("/iniciar-sesion", iniciarSesionRoute);

ruteador.get("/", (pet, res) => {
    res.status(200).json({
        message: "¡Bienvenido a sesión!",
    });
});

module.exports = ruteador;