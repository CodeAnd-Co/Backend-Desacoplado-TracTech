// RF39: Administrador crea usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF39
// RF40 Administrador consulta usuarios - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF40
// RF43 Administrador elimina usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF43

const express = require('express');
const ruteador = express.Router();

const consultarUsuariosRuta = require('./consultarUsuarios.ruta');
const crearUsuarioRuta = require('./crearUsuario.ruta');
const eliminarUsuarioRuta = require('./eliminarUsuario.ruta');

ruteador.use('/consultar-usuarios', consultarUsuariosRuta);
ruteador.use('/crear-usuario', crearUsuarioRuta);
ruteador.use('/eliminar-usuario', eliminarUsuarioRuta);

module.exports = ruteador;