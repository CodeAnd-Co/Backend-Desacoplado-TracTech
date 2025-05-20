const Plantilla = require('../modelos/modeloPlantillas.js');

async function insertarPlantilla(props) {
  return Plantilla.insertar(props);
}

module.exports = { insertarPlantilla };