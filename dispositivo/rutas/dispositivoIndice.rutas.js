const express = require('express');
const ruteador = express.Router();

// Importar rutas específicas
const verificarEstadoRuta = require('./verificarEstadoDispositivo.ruta');
const habilitarDispositivoRuta = require('./habilitarDispositivo.ruta');
const deshabilitarDispositivoRuta = require('./deshabilitarDispositivo.ruta');
const listarDispositivosRuta = require('./listarDispositivos.ruta');

// Usar las rutas
ruteador.use('/estado', verificarEstadoRuta);
ruteador.use('/habilitar', habilitarDispositivoRuta);
ruteador.use('/deshabilitar', deshabilitarDispositivoRuta);
ruteador.use('/listar', listarDispositivosRuta);

ruteador.get("/", (pet, res) => {
    res.status(200).json({
        message: "¡Bienvenido a dispositivos!",
    });
});

module.exports = ruteador;
