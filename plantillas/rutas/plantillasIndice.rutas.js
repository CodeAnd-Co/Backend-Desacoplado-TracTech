//RF21 Usuario elimina plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF21
//RF23 Usuario consulta plantillas de reporte. - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF23

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