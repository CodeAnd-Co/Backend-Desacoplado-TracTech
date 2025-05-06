// RF39: Administrador crea usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF39
// RF40 Administrador consulta usuarios - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF40
// RF41 Administrador modifica usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF41

const express = require('express');
const ruteador = express.Router();

const consultarUsuariosRuta = require('./consultarUsuarios.ruta');
const crearUsuarioRuta = require('./crearUsuario.ruta');
const modificarUsuarioRuta = require('./modificarUsuario.ruta');

ruteador.use('/consultar-usuarios', consultarUsuariosRuta);
ruteador.use('/crear-usuario', crearUsuarioRuta);
ruteador.use('/modificar-usuario', modificarUsuarioRuta);

module.exports = ruteador;