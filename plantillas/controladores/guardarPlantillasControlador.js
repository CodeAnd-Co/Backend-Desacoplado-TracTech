//RF22 Usuario guarda plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF22

// Se importa el repositorio y el modelo
const { guardarPlantillaRepositorio } = require('../data/repositorios/plantillas.repositorio.js');
const { PlantillaReporte } = require('../data/modelos/modeloGuardarPlantilla.js');

/**
 * Controlador para guardar una nueva plantilla
 * @param {object} pet - Objeto de petición de Express
 * @param {object} res - Objeto de respuesta de Express
 * @returns {object} Respuesta JSON con el ID de la nueva plantilla o mensaje de error
 */
exports.guardarPlantilla = async (pet, res) => {
  try {
    const { plantilla } = pet.body;
    
    if (!plantilla) {
      return res.status(400).json({
        mensaje: 'No se proporcionaron datos de la plantilla'
      });
    }

    if (!plantilla.nombrePlantilla || !plantilla.datos) {
      return res.status(400).json({
        mensaje: 'Nombre de plantilla y datos son campos requeridos'
      });
    }

    // Crear instancia de PlantillaReporte
    const nuevaPlantilla = new PlantillaReporte({
      nombrePlantilla: plantilla.nombrePlantilla,
      datos: plantilla.datos,
      frecuenciaEnvio: plantilla.frecuenciaEnvio || null,
      correoDestino: plantilla.correoDestino || null,
      numeroDestino: plantilla.numeroDestino || null
    });

    // Guardar la plantilla en la base de datos
    const idInsertado = await guardarPlantillaRepositorio(nuevaPlantilla);

    res.status(201).json({
      mensaje: 'Plantilla guardada exitosamente',
      id: idInsertado
    });
  } catch (error) {
    console.error('Error al guardar plantilla:', error);
    res.status(500).json({
      mensaje: 'Error interno del servidor'
    });
  }
};