//RF35 Usuario selecciona plantilla. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF35

const SeleccionarPlantilla = require('../modelos/modeloSeleccionarPlantilla.js');

/**
 * Obtiene una plantilla específica por su ID
 * @param {number} idPlantilla - ID de la plantilla a consultar
 * @returns {Promise<Array>} - Datos de la plantilla solicitada
 */
async function obtenerPlantillaRepositorio(idPlantilla) {
  return SeleccionarPlantilla.obtenerPlantilla(idPlantilla);
}

module.exports = {
  obtenerPlantillaRepositorio
};