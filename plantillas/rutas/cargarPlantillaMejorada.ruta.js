//RF35 Usuario selecciona y aplica plantilla mejorada

const express = require('express');
const ruteador = express.Router();

const cargarPlantillaMejoradaControlador = require('../controladores/cargarPlantillaMejoradaControlador');

// Ruta mejorada para cargar y aplicar plantillas
ruteador.post('/aplicar', cargarPlantillaMejoradaControlador.cargarYAplicarPlantilla);

// Ruta de compatibilidad hacia atrás
ruteador.post('/', cargarPlantillaMejoradaControlador.seleccionarPlantilla);

module.exports = ruteador;
