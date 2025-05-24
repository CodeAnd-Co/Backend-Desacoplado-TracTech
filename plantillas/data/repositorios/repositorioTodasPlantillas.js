const TodasPlantillas = require('../modelos/modeloTodasPlantillas.js');

/**
 * Obtiene todas las plantillas disponibles
 * @returns {Promise<Array>} Lista de plantillas
 */
async function obtenerTodasPlantillasRepositorio() {
  return TodasPlantillas.obtenerTodasPlantillas();
}

module.exports = {
  obtenerTodasPlantillasRepositorio
};