// RF2 Usuario registrado inicia sesión - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF2
// RF3 Usuario cierra sesión - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF3

const { Router } = require('express');
const iniciarSesionRuta = require('./iniciarSesion.ruta');
const cerrarSesionRuta = require('./cerrarSesion.ruta');

const ruteador = Router();

ruteador.use('/iniciarSesion', iniciarSesionRuta);
ruteador.use('/cerrarSesion', cerrarSesionRuta);

module.exports = ruteador;