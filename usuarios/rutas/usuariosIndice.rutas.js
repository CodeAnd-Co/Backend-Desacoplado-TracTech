// RF39: Administrador crea usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF39
// RF40 Administrador consulta usuarios - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF40
// RF41 Administrador modifica usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF41
// RF43 Administrador elimina usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF43

const express = require('express');
const consultarUsuariosRuta = require('./consultarUsuarios.ruta');
const crearUsuarioRuta = require('./crearUsuario.ruta');
const modificarUsuarioRuta = require('./modificarUsuario.ruta');
const eliminarUsuarioRuta = require('./eliminarUsuario.ruta');
const consultarRolesRuta = require('./consultarRoles.ruta');

const ruteador = express.Router();

ruteador.use('/consultarUsuarios', consultarUsuariosRuta);
ruteador.use('/crearUsuario', crearUsuarioRuta);
ruteador.use('/modificarUsuario', modificarUsuarioRuta);
ruteador.use('/eliminarUsuario', eliminarUsuarioRuta);
ruteador.use('/consultarRolesUsuarios', consultarRolesRuta);

module.exports = ruteador;