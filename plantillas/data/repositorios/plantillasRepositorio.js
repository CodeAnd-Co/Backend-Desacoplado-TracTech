//RF34 Usuario guarda plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF34

const PlantillaReporte = require('../modelos/modeloGuardarPlantilla.js');
/**
 * Guarda una nueva plantilla en la base de datos
 * @param {Object} plantilla - Objeto con los datos de la plantilla
 * @returns {Promise<number>} Promesa que resuelve con el ID de la plantilla insertada
 * @throws {Error} Error si no se puede insertar la plantilla
 */
function insertarPlantillaReporte(plantilla) {
  // Debes devolver la promesa para que se resuelva correctamente
  return PlantillaReporte.insertarPlantillaReporte(plantilla);
}

module.exports = {
  insertarPlantillaReporte
};