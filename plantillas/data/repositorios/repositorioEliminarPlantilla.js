//RF33 Usuario elimina plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF33

const EliminarPlantilla = require('../modelos/modeloEliminarPlantilla.js');
const { modeloEliminarPlantilla } = require('../modelos/modeloEliminarPlantilla.js');

/**
 * Repositorio que coordina la eliminación de una plantilla.
 * @param {string} idPlantilla - ID de la plantilla a eliminar.
 * @returns {Promise<void>} - Promesa que se resuelve cuando la plantilla es eliminada.
*/
async function eliminarPlantillaRepositorio(idPlantilla) {
    return await EliminarPlantilla.eliminarPlantilla(idPlantilla);
}

module.exports = {
    eliminarPlantillaRepositorio
};