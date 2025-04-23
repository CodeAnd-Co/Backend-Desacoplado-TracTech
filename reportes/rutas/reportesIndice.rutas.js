const express = require('express');
const ruteador = express.Router();

const consultarPlantillasRuta = require("./consultarPlantillas.ruta");

ruteador.use("/consultar-plantillas", consultarPlantillasRuta);

ruteador.get("/", (pet, res) => {
    res.status(200).json({
        message: "¡Bienvenido a reportes!",
    });
});

module.exports = ruteador;