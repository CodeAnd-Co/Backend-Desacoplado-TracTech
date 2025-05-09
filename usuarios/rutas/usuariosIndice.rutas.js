// RF39: Administrador crea usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF39
// RF40 Administrador consulta usuarios - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF40
// RF43 Administrador elimina usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF43

const express = require('express');
const consultarUsuariosRuta = require('./consultarUsuarios.ruta');
const crearUsuarioRuta = require('./crearUsuario.ruta');
const eliminarUsuarioRuta = require('./eliminarUsuario.ruta');

const ruteador = express.Router();

ruteador.use('/consultarUsuarios', consultarUsuariosRuta);
ruteador.use('/crearUsuario', crearUsuarioRuta);
ruteador.use('/eliminarUsuario', eliminarUsuarioRuta);

module.exports = ruteador;