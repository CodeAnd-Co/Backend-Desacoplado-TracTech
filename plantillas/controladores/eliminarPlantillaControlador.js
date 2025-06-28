//RF33 Usuario elimina plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF33

const { eliminarPlantillaRepositorio } = require('../data/repositorios/repositorioEliminarPlantilla.js');

/**
 * Controlador para eliminar una plantilla
 */
exports.eliminarPlantilla = async (req, res) => {
  const { idPlantilla } = req.body;
  
  if (!idPlantilla) {
    return res.status(400).json({ mensaje: 'Falta idPlantilla' });
  }
  
  try {
    await eliminarPlantillaRepositorio(idPlantilla);
    res.status(200).json({ mensaje: 'Eliminación exitosa' });
  } catch {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};