const Plantilla = require('../modelos/modeloPlantillas.js');

async function insertarPlantilla(props) {
  return Plantilla.insertarPlantilla(props);
}

module.exports = { insertarPlantilla };