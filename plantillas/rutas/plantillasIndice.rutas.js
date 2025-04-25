const express = require('express');
const ruteador = express.Router();

const seleccionarPlantillaRuta = require("./seleccionarPlantilla.ruta");
const consultarPlantillas = require("./consultarPlantillas.ruta");
const eliminarPlantillas = require("./eliminarPlantillas.ruta");

ruteador.use("/seleccionar", seleccionarPlantillaRuta);
ruteador.use("/consultar", consultarPlantillas);
ruteador.use("/eliminar", eliminarPlantillas);

ruteador.get("/", (pet, res) => {
    res.status(200).json({
        message: "¡Bienvenido a plantillas!",
    });
});

module.exports = ruteador;