//RF32 Usuario consulta plantillas de reporte. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF32

const { obtenerPlantillaCompletaRepositorio } = require('../data/repositorios/repositorioPlantillaCompleta.js');

/**
 * Controlador para consultar plantilla completa
 */
exports.consultarPlantillaCompleta = async (req, res) => {
  const { idPlantilla } = req.body;
  
  if (!idPlantilla) {
    return res.status(400).json({ mensaje: 'Falta idPlantilla' });
  }
  
  try {
    const resultado = await obtenerPlantillaCompletaRepositorio(idPlantilla);
    
    if (!resultado) {
      return res.status(404).json({ mensaje: 'Plantilla no encontrada' });
    }
    
    res.status(200).json({ 
      mensaje: 'Consulta exitosa', 
      plantillaCompleta: resultado 
    });
    
  } catch {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};