// RF2 Usuario registrado inicia sesión - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF2
// RF3 Usuario cierra sesión - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF3

const express = require('express');
const ruteador = express.Router();

const iniciarSesionRuta = require('./iniciarSesion.ruta');
const cerrarSesionRuta = require('./cerrarSesion.ruta');

ruteador.use('/iniciar-sesion', iniciarSesionRuta);
ruteador.use('/cerrar-sesion', cerrarSesionRuta);

module.exports = ruteador;