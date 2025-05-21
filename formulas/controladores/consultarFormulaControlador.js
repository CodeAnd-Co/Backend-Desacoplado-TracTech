// RF76 - Consulta fórmulas - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF76

const { consultarFormulaModelo } = require('../data/modelos/consultarFormulaModelo.js');

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
    const datos = await consultarFormulaModelo((err, resultado) => {
        if (err) {
            return res.status(500).json({
                mensaje: 'Error de conexión, intente más tarde',
            });
        }
        return resultado;
    });
    if (!datos) {
        return res.status(500).json({
            mensaje: 'Error al consultar las fórmulas: no se encintraron fórmulas',
        });
    }
    res.status(200).json({
        mensaje: 'Fórmulas consultadas con éxito',
        datos,
    }); 

}

