require("dotenv").config();
const express = require("express");

const app = express();
const puerto = process.env.PUERTO || 8080;

const bodyParser = require("body-parser");

app.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );
app.use(bodyParser.json());

const sesionRutas = require("./sesion/rutas/sesionIndice.rutas");
const reportesRutas = require("./reportes/rutas/reportesIndice.rutas");
const formulasRutas = require("./formulas/rutas/formulasIndice.rutas");

app.use("/sesion", sesionRutas);
app.use("/reportes", reportesRutas);
app.use("/formulas", formulasRutas);

app.get("/", (pet, res) => {
    res.status(200).json({
      message: "¡Bienvenido a Harvester!",
    });
  });


app.use((pet, res) => {
    res.status(404).json({
      message: "No se encuentra el endpoint o ruta que estas buscando",
    });
  });

  app.listen(puerto, () => {
    console.log(`Servidor escuchando en el puerto ${puerto}`);
  });