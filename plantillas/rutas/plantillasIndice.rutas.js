const express = require('express');
const ruteador = express.Router();

// Importar rutas específicas
const consultarPlantillasRuta = require('./consultarPlantillas.ruta');
const consultarPlantillaPorIdRuta = require('./consultarPlantillaPorId.ruta');
const guardarPlantillaRuta = require('./guardarPlantilla.ruta');
const eliminarPlantillaRuta = require('./eliminarPlantilla.ruta');


// // Usar las rutas
ruteador.use('/consultarPlantillas', consultarPlantillasRuta);
ruteador.use('/consultarPlantilla', consultarPlantillaPorIdRuta);
ruteador.use('/guardarPlantilla', guardarPlantillaRuta);
ruteador.use('/eliminarPlantilla', eliminarPlantillaRuta);


module.exports = ruteador;