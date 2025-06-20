//RF35 Usuario selecciona plantilla. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF35

const { obtenerPlantillaRepositorio } = require('../data/repositorios/repositorioSeleccionarPlantilla.js');

/**
 * Controlador para seleccionar una plantilla por su ID
 */
exports.seleccionarPlantilla = async (req, res) => {
  // Se extrae el idPlantilla del cuerpo de la petición
  const { idPlantilla } = req.body;

  // Si no se proporciona idPlantilla, se devuelve un error 400 (Bad Request)
  if (!idPlantilla) {
    return res.status(400).json({
      mensaje: 'Faltan datos requeridos',
    });
  }

  try {
    // Se obtiene la plantilla desde el repositorio
    const plantillaConsultada = await obtenerPlantillaRepositorio(idPlantilla);
    
    if (plantillaConsultada.length === 0) {
      return res.status(404).json({
        mensaje: 'Plantilla no encontrada',
      });
    }

    // Se responde con un mensaje de éxito y se devuelve la plantilla encontrada
    res.status(200).json({
      mensaje: 'Consulta de plantilla exitosa',
      plantilla: plantillaConsultada[0], // Se devuelve el primer resultado
    });
  } catch {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};