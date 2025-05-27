const conexion = require('../../../util/servicios/bd.js');

class TodasPlantillas {
  /**
   * Obtiene un listado de todas las plantillas con información básica
   * @returns {Promise<Array>} - Lista de plantillas con sus datos básicos
   */
  static async obtenerTodasPlantillas() {
    // Consulta SQL que obtiene datos básicos de todas las plantillas
    const query = `
      SELECT 
        pr.idPlantillaReporte, 
        pr.Nombre, 
        pr.Datos, 
        pr.FrecuenciaEnvio, 
        pr.CorreoDestino, 
        pr.NumeroDestino,
        p.NombrePlantilla
      FROM 
        plantillareporte pr
        JOIN plantilla p ON pr.IdPlantilla = p.IdPlantilla
      ORDER BY 
        pr.idPlantillaReporte DESC`;
    return new Promise((resolve, reject) => {
      conexion.query(query, (err, resultados) => {
        if (err) {
          console.error('Error al consultar plantillas:', err);
          return reject(err);
        }
        
        // Transformar resultados a formato para el frontend
        const plantillas = resultados.map(plantilla => ({
          idPlantillaReporte: plantilla.idPlantillaReporte,
          Nombre: plantilla.Nombre || plantilla.NombrePlantilla,
          Datos: plantilla.Datos,
          FrecuenciaEnvio: plantilla.FrecuenciaEnvio,
          CorreoDestino: plantilla.CorreoDestino,
          NumeroDestino: plantilla.NumeroDestino
        }));
        
        resolve(plantillas);
      });
    });
  }
}

module.exports = TodasPlantillas;