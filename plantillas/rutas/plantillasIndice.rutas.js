//RF32 Usuario consulta plantillas de reporte. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF32
//RF33 Usuario elimina plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF33
//RF34 Usuario guarda plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF34
//RF35 Usuario selecciona plantilla. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF35

const express = require('express');
const ruteador = express.Router();

const seleccionarPlantillaRuta = require('./seleccionarPlantilla.ruta');
const consultarTodasPlantillas = require('./consultarTodasPlantillas.ruta');
const consultarPlantillaCompleta = require('./consultarPlantillaCompleta.ruta');
const eliminarPlantillas = require('./eliminarPlantillas.ruta');
const guardarPlantilla = require('./guardarPlantillas.ruta');

ruteador.use('/seleccionar', seleccionarPlantillaRuta);
ruteador.use('/consultarTodas', consultarTodasPlantillas);
ruteador.use('/consultarCompleta', consultarPlantillaCompleta);
ruteador.use('/eliminar', eliminarPlantillas);
ruteador.use('/guardar', guardarPlantilla);

ruteador.get('/', (pet, res) => {
    res.status(200).json({
        mensaje: '¡Bienvenido a plantillas!',
    });
});

module.exports = ruteador;