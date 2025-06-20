//RF34 Usuario guarda plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF34

const Grafica= require('../modelos/modeloGráfica');

async function insertarGraficaRepositorio(props) {
  return Grafica.insertar(props);
}

module.exports = { insertarGraficaRepositorio };