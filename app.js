require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Necesario para manejar cookies
const csurf = require('csurf'); // Importa el middleware csurf

const app = express();
const puerto = process.env.PUERTO || 8080;

// Configuración de body-parser
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// Configuración de cookie-parser
app.use(cookieParser());

// Configuración de csurf
const csrfProtection = csurf({ cookie: true }); // Habilita la protección CSRF con cookies
app.use(csrfProtection); // Aplica el middleware de protección CSRF

// Rutas
const sesionRutas = require('./sesion/rutas/sesionIndice.rutas');
const reportesRutas = require('./reportes/rutas/reportesIndice.rutas');
const plantillasRutas = require('./plantillas/rutas/plantillasIndice.rutas');
const formulasRutas = require('./formulas/rutas/formulasIndice.rutas');
const usuariosRutas = require('./usuarios/rutas/usuariosIndice.rutas');

app.use('/sesion', sesionRutas);
app.use('/reportes', reportesRutas);
app.use('/plantillas', plantillasRutas);
app.use('/formulas', formulasRutas);
app.use('/usuarios', usuariosRutas);

// Middleware de autenticación y permisos
const verificarToken = require('./util/middlewareAutenticacion');
const { verificarPermisos } = require('./util/middlewarePermisos');

// Ruta principal con protección CSRF
app.get('/', verificarToken, verificarPermisos, (pet, res) => {
  res.status(200).json({
    mensaje: '¡Bienvenido a Harvester!',
    valido: true,
    permisos: pet.permisos,
    csrfToken: pet.csrfToken(), // Devuelve el token CSRF al cliente
  });
});

// Manejo de rutas no encontradas
app.use((peticion, respuesta) => {
  respuesta.status(404).json({
    mensaje: 'No se encuentra el endpoint o ruta que estas buscando',
  });
});

// Inicia el servidor
app.listen(puerto, () => {
  console.log(`Servidor escuchando en el puerto ${puerto}`);
});