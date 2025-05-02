// RF40 Administrador consulta usuarios - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF40

const express = require('express');
const ruteador = express.Router();

const consultarUsuariosRuta = require('./consultarUsuarios.ruta');

ruteador.use('/consultar-usuarios', consultarUsuariosRuta);

ruteador.get('/', (peticion, respuesta) => {
  respuesta.sendStatus(200);
});

module.exports = ruteador;