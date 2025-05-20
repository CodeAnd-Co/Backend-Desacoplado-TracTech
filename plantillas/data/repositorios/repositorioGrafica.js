const Grafica= require('../modelos/modeloGráfica');

async function insertarGraficaRepositorio(props) {
  return Grafica.insertar(props);
}

module.exports = { insertarGraficaRepositorio };