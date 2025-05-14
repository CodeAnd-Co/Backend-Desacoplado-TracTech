require('dotenv').config();
const express = require('express');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); 


const app = express();
const puerto = process.env.PUERTO || 8080;


app.use(bodyParser.urlencoded({extended: false,}));
app.use(bodyParser.json());
app.use(cookieParser());

const csrfProteccion = csrf({
  cookie: false, // No usar cookies
  value: (req) => req.headers['x-csrf-token'], // Busca el token en el encabezado 'X-CSRF-Token'
});

/* ========= 2. Excluir solo el login de la verificación ========= */
app.use((peticion, respuesta, next) => {
  const rutasExcluidas = ['/sesion/iniciarSesion'];   // <── aquí tu ruta
  if (rutasExcluidas.includes(peticion.path)) {
    return next();        // no verifica CSRF aquí
  }
  console.log(`[DEBUG] Token CSRF esperado: ${respuesta.locals.csrf}`);
  console.log(`[DEBUG] Token CSRF recibido: ${peticion.headers['X-CSRF-Token']}`);

  csrfProteccion(peticion, respuesta, next); // sí lo verifica en las demás
});

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

const verificarToken = require('./util/middlewareAutenticacion');
const { verificarPermisos } = require('./util/middlewarePermisos');

app.get('/', verificarToken, verificarPermisos, (pet, res) => {
    res.status(200).json({
      message: '¡Bienvenido a Harvester!',
      valido: true,
      permisos: pet.permisos,
    });
});

app.use((peticion, respuesta) => {
    respuesta.status(404).json({
      message: 'No se encuentra el endpoint o ruta que estas buscando',
    });
  });

app.listen(puerto, () => {
  console.log(`Servidor escuchando en el puerto ${puerto}`);
});