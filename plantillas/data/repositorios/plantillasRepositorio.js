//RF22 Usuario guarda plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF22
const PlantillaReporte = require('../modelos/modeloGuardarPlantilla.js');
/**
 * Guarda una nueva plantilla en la base de datos
 * @param {Object} plantilla - Objeto con los datos de la plantilla
 * @returns {Promise<number>} Promesa que resuelve con el ID de la plantilla insertada
 * @throws {Error} Error si no se puede insertar la plantilla
 */
function insertarPlantillaReporte(plantilla) {
  PlantillaReporte.insertarPlantillaReporte(plantilla);
}

module.exports = {
  insertarPlantillaReporte
};