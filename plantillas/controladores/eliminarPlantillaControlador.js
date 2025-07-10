const { eliminarPlantillaPorTituloRepositorio } = require('../data/repositorios/eliminarPlantillaRepositorio.js');

/**
 * @async
 * @function eliminarPlantillaPorTitulo
 * @param {Object} pet - Petición HTTP.
 * @param {Object} res - Respuesta HTTP.
 * @description Controlador para eliminar una plantilla de la base de datos por su título.
 * @returns {Promise<void>} Promesa que resuelve cuando se envía la respuesta.
 * @throws {Error} Si ocurre un error al eliminar la plantilla.
 */
exports.eliminarPlantillaPorTitulo = async (pet, res) => {
    try {
        const { titulo } = pet.params;
        
        // Validar que se proporcione el título
        if (!titulo) {
            return res.status(400).json({
                mensaje: 'Título de plantilla es requerido',
            });
        }

        // Convertir guiones bajos a espacios para la búsqueda en la base de datos
        const tituloConvertido = titulo.replace(/_/g, ' ');

        const resultado = await eliminarPlantillaPorTituloRepositorio(tituloConvertido);
        
        if (resultado.mensaje) {
            return res.status(500).json({
                mensaje: 'Error al eliminar la plantilla',
            });
        }

        // Verificar si se eliminó algún registro
        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Plantilla no encontrada',
            });
        }

        res.status(200).json({
            mensaje: 'Plantilla eliminada con éxito',
        });
    } catch {
        return res.status(500).json({
            mensaje: 'Error de conexión, intente más tarde',
        });
    }
};
