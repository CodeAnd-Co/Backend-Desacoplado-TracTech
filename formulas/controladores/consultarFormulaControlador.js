// RF76 - Consulta fórmulas - http...

const conexion = require('../../util/bd.js');

/**
 * @async
 * @function consultarFormula
 * @param {Object} pet - Petición HTTP.
 * @param {Object} res - Respuesta HTTP.
 * @description Controlador para consultar todas las fórmulas de la base de datos.
 * @returns {Promise<void>} Promesa que resuelve cuando se envía la respuesta.
 * @throws {Error} Si ocurre un error al consultar las fórmulas.
 */
exports.consultarFormula = async (pet, res) => {
    const datos = await consultarFormula((err, resultado) => {
        if (err) {
            return res.status(500).json({
                mensaje: 'Error al consultar las fórmulas',
            });
        }
        return resultado;
    });
    if (!datos) {
        return res.status(500).json({
            mensaje: 'Error al consultar las fórmulas',
        });
    }
    res.status(200).json({
        mensaje: 'Fórmulas consultadas con éxito',
        datos: datos,
    }); 

}

/**
 * @async
 * @function consultarFormula
 * @description Función para consultar todas las fórmulas de la base de datos.
 * @returns {Promise<Object>} Promesa que resuelve con el resultado de la consulta.
 * @throws {Error} Si ocurre un error al ejecutar la consulta.
 */
async function consultarFormula() {
    return new Promise((resolver, rechazar) => {
        // Consulta SQL para obtener todas las fórmulas de la base de datos
        const consulta = 'SELECT * FROM formula';
        // Ejecuta la consulta
        conexion.query(consulta, (err, resultado) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                return rechazar(err);
            }
            resolver(resultado); // Regresa el resultado de la consulta
        });
    });
}