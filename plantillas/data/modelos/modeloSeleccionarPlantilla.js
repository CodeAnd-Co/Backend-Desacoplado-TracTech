const conexion = require('../../../util/servicios/bd.js');

class SeleccionarPlantilla {
  /**
   * Obtiene una plantilla específica por su ID
   * @param {number} idPlantilla - ID de la plantilla a consultar
   * @returns {Promise<Array>} - Datos de la plantilla solicitada
   */
  static async obtenerPlantilla(idPlantilla) {
    return new Promise((resolver, rechazar) => {
      const consulta = 'SELECT * FROM plantillareporte WHERE idPlantillaReporte = ?';

      // Se ejecuta la consulta con el valor de idPlantilla como parámetro para evitar inyecciones SQL
      conexion.query(consulta, [idPlantilla], (err, resultados) => {
        if (err) {
          return rechazar(err);
        }

        // Si no hay error, se resuelve la promesa con los resultados obtenidos
        resolver(resultados);
      });
    });
  }
}

module.exports = SeleccionarPlantilla;