//RF34 Usuario guarda plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF34

const Grafica= require('../modelos/modeloGráfica');

/**
 * Inserta una nueva gráfica con información completa del sistema mejorado
 * @param {Object} props - Propiedades de la gráfica (incluye campos nuevos)
 * @returns {Promise<number>} - ID de la gráfica insertada
 */
async function insertarGraficaRepositorio(props) {
  return Grafica.insertar(props);
}

/**
 * Obtiene información completa de una gráfica
 * @param {number} idGrafica - ID de la gráfica
 * @returns {Promise<Object>} - Datos completos de la gráfica
 */
async function obtenerGraficaCompletaRepositorio(idGrafica) {
  return Grafica.obtenerCompleta(idGrafica);
}

module.exports = { 
  insertarGraficaRepositorio,
  obtenerGraficaCompletaRepositorio 
};