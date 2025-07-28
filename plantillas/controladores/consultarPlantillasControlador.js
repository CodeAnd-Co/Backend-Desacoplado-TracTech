const { consultarPlantillasRepositorio} = require('../data/repositorios/consultarPlantillasRepositorio.js');

/**
 * @async
 * @function consultarPlantillas
 * @param {Object} pet - Petición HTTP.
 * @param {Object} res - Respuesta HTTP.
 * @description Controlador para consultar todas las plantillas de la base de datos.
 * @returns {Promise<void>} Promesa que resuelve cuando se envía la respuesta.
 * @throws {Error} Si ocurre un error al consultar las plantillas.
 */
exports.consultarPlantillas = async (pet, res) => {
    const datos = await consultarPlantillasRepositorio((err, resultado) => {
        if (err) {
            return res.status(500).json({
                mensaje: 'Error de conexión, intente más tarde',
            });
        }
        return resultado;
    });
    if (datos.length === 0) {
        return res.status(500).json({
            mensaje: 'Error al consultar las plantillas: no se encontraron plantillas',
        });
    }
    res.status(200).json({
        mensaje: 'Plantillas consultadas con éxito',
        datos,
    }); 

}
