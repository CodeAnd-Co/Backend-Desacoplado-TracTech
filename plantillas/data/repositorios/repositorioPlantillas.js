//RF34 Usuario guarda plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF34

const Plantilla = require('../modelos/modeloPlantillas.js');

async function insertarPlantilla(props) {
  return Plantilla.insertarPlantilla(props);
}

module.exports = { insertarPlantilla };