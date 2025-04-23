const express = require('express');
const ruteador = express.Router();

const seleccionarPlantillaRuta = require("./seleccionarPlantilla.ruta");

ruteador.use("/seleccionar", seleccionarPlantillaRuta);

ruteador.get("/", (pet, res) => {
    res.status(200).json({
        message: "¡Bienvenido a reportes!",
    });
});

module.exports = ruteador;