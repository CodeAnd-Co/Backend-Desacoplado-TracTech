// RF68 - Modificar fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF68 
const { modificarFormulaRepositorio } = require('../data/repositorios/modificarFormulaRepositorio');

/**
 * @function modificarFormula
 * @description Controlador para modificar una fórmula en la base de datos.
 * @param {Object} pet - Objeto de la petición HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 * @returns {Object} Respuesta JSON con el mensaje de éxito o error.
 */
exports.modificarFormula = async (pet, res) => {
    try {
        const { id, nombre, formula } = pet.body;
        
        if (!id || !nombre || !formula) {
            return res.status(400).json({
                mensaje: 'Faltan datos requeridos',
            });
        }

        const idNumero = parseInt(id, 10);
        
        const resultado = await modificarFormulaRepositorio(idNumero, nombre, formula);
        
        if (resultado && resultado.status) {
            return res.status(resultado.status).json({
                mensaje: resultado.mensaje
            });
        }
        
        return res.status(200).json({
            mensaje: 'Fórmula modificada con éxito',
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: 'Error interno del servidor, intente más tarde',
        });
    }
};
