//RF32 Usuario consulta plantillas de reporte. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF32

const PlantillaCompleta = require('../modelos/modeloPlantillaCompleta.js');

/**
 * Obtiene una plantilla completa con todos sus componentes
 * @param {number} idPlantilla - ID de la plantilla a consultar
 * @returns {Promise<Object>} - Plantilla completa con sus componentes
 */
async function obtenerPlantillaCompletaRepositorio(idPlantilla) {
  return PlantillaCompleta.obtenerPlantillaCompleta(idPlantilla);
}

module.exports = {
  obtenerPlantillaCompletaRepositorio
};