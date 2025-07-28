const { guardarPlantillaRepositorio } = require('../data/repositorios/guardarPlantillaRepositorio.js');

/**
 * @async
 * @function guardarPlantilla
 * @param {Object} pet - Petición HTTP.
 * @param {Object} res - Respuesta HTTP.
 * @description Controlador para guardar una nueva plantilla en la base de datos.
 * @returns {Promise<void>} Promesa que resuelve cuando se envía la respuesta.
 * @throws {Error} Si ocurre un error al guardar la plantilla.
 */
exports.guardarPlantilla = async (pet, res) => {
    try {
        const { titulo, contenido } = pet.body;
        
        // Validar datos requeridos
        if (!titulo  || !contenido) {
            return res.status(400).json({
                mensaje: 'Faltan datos requeridos: titulo y contenido son obligatorios',
            });
        }

        const datosPlantilla = { titulo, contenido };
        const resultado = await guardarPlantillaRepositorio(datosPlantilla);
        
        if (resultado.mensaje) {
            return res.status(500).json({
                mensaje: 'Error al guardar la plantilla',
            });
        }

        res.status(201).json({
            mensaje: 'Plantilla guardada con éxito',
            id: resultado.insertId,
        });
    } catch {
        return res.status(500).json({
            mensaje: 'Error de conexión, intente más tarde',
        });
    }
};
