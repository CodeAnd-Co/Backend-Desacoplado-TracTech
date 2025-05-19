const conexion = require('../../util/bd.js');

/**
 * Obtiene un listado de todas las plantillas con información básica
 * 
 * @returns {Promise<Array>} - Lista de plantillas con sus datos básicos
 */
async function obtenerTodasPlantillas() {
  return new Promise((resolve, reject) => {
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

/**
 * Controlador para consultar todas las plantillas
 */
exports.consultarTodasPlantillas = async (req, res) => {
  try {
    const plantillas = await obtenerTodasPlantillas();
    
    if (plantillas.length === 0) {
      return res.status(404).json({ 
        mensaje: 'No se encontraron plantillas',
        plantillas: [] 
      });
    }
    
    res.status(200).json({ 
      mensaje: 'Consulta exitosa', 
      plantillas 
    });
    
  } catch (error) {
    console.error('Error al consultar todas las plantillas:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};