const { eliminarPlantillaRepositorio } = require('../data/repositorios/eliminarPlantillaRepositorio.js');

/**
 * @async
 * @function eliminarPlantilla
 * @param {Object} pet - Petición HTTP.
 * @param {Object} res - Respuesta HTTP.
 * @description Controlador para eliminar una plantilla de la base de datos.
 * @returns {Promise<void>} Promesa que resuelve cuando se envía la respuesta.
 * @throws {Error} Si ocurre un error al eliminar la plantilla.
 */
exports.eliminarPlantilla = async (pet, res) => {
    try {
        const { id } = pet.params;
        
        // Validar que se proporcione el ID
        if (!id) {
            return res.status(400).json({
                mensaje: 'ID de plantilla es requerido',
            });
        }

        const resultado = await eliminarPlantillaRepositorio(id);
        
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
