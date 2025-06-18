// RF2 Usuario registrado inicia sesión - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF2
// RF5 Usuario cierra sesión - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF5

const { Router } = require('express');
const iniciarSesionRuta = require('./iniciarSesion.ruta');
const cerrarSesionRuta = require('./cerrarSesion.ruta');

const ruteador = Router();

ruteador.use('/iniciarSesion', iniciarSesionRuta);
ruteador.use('/cerrarSesion', cerrarSesionRuta);

module.exports = ruteador;