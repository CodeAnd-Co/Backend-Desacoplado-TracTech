const { obtenerTodasPlantillasRepositorio } = require('../data/repositorios/repositorioTodasPlantillas.js');

/**
 * Controlador para consultar todas las plantillas
 */
exports.consultarTodasPlantillas = async (req, res) => {
  try {
    const plantillas = await obtenerTodasPlantillasRepositorio();
    
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
    
  } catch {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};