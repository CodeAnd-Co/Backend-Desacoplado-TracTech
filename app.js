require('dotenv').config();
const express = require('express');

const app = express();
const puerto = process.env.PUERTO || 8080;

const bodyParser = require('body-parser');

const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const opciones = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Endpoints de Harvester",
      version: "1.0.0",
      description: "Documentación generada con Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: [
    "./sesion/rutas/*.js",
    "./reportes/rutas/*.js", 
    "./plantillas/rutas/*.js",
    "./formulas/rutas/*.js",
    "./usuarios/rutas/*.js"
  ], 
};

const specs = swaggerJsDoc(opciones);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );
app.use(bodyParser.json());

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



app.use((peticion, respuesta) => {
    respuesta.status(404).json({
      message: 'No se encuentra el endpoint o ruta que estas buscando',
    });
  });

  app.listen(puerto, () => {
    console.log(`Servidor escuchando en el puerto ${puerto}`);
  });