//RF34 Usuario guarda plantilla de reporte. - Repositorio para fórmulas de plantillas

const FormulasPlantilla = require('../modelos/modeloFormulasPlantilla');

/**
 * Inserta una nueva fórmula asociada a una gráfica
 * @param {Object} props - Propiedades de la fórmula
 * @returns {Promise<number>} - ID de la fórmula insertada
 */
async function insertarFormulaRepositorio(props) {
  return FormulasPlantilla.insertar(props);
}

/**
 * Obtiene todas las fórmulas de una gráfica
 * @param {number} idGrafica - ID de la gráfica
 * @returns {Promise<Array>} - Lista de fórmulas
 */
async function obtenerFormulasPorGraficaRepositorio(idGrafica) {
  return FormulasPlantilla.obtenerPorGrafica(idGrafica);
}

/**
 * Elimina todas las fórmulas de una gráfica
 * @param {number} idGrafica - ID de la gráfica
 * @returns {Promise<boolean>} - Resultado de la operación
 */
async function eliminarFormulasPorGraficaRepositorio(idGrafica) {
  return FormulasPlantilla.eliminarPorGrafica(idGrafica);
}

module.exports = {
  insertarFormulaRepositorio,
  obtenerFormulasPorGraficaRepositorio,
  eliminarFormulasPorGraficaRepositorio
};
