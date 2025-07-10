const { consultarPlantillaPorIdRepositorio } = require('../data/repositorios/consultarPlantillaPorIdRepositorio.js');

/**
 * @async
 * @function consultarPlantillaPorId
 * @param {Object} pet - Petición HTTP.
 * @param {Object} res - Respuesta HTTP.
 * @description Controlador para consultar una plantilla específica por su ID.
 * @returns {Promise<void>} Promesa que resuelve cuando se envía la respuesta.
 * @throws {Error} Si ocurre un error al consultar la plantilla.
 */
exports.consultarPlantillaPorId = async (pet, res) => {
    try {
        const { id } = pet.params;
        
        // Validar que se proporcione el ID
        if (!id) {
            return res.status(400).json({
                mensaje: 'ID de plantilla es requerido',
            });
        }

        const datos = await consultarPlantillaPorIdRepositorio(id);
        
        if (datos.mensaje) {
            return res.status(500).json({
                mensaje: 'Error al consultar la plantilla',
            });
        }

        // Verificar si se encontró la plantilla
        if (datos.length === 0) {
            return res.status(404).json({
                mensaje: 'Plantilla no encontrada',
            });
        }

        res.status(200).json({
            mensaje: 'Plantilla consultada con éxito',
            datos: datos[0], // Retorna solo la primera plantilla encontrada
        });
    } catch {
        return res.status(500).json({
            mensaje: 'Error de conexión, intente más tarde',
        });
    }
};
