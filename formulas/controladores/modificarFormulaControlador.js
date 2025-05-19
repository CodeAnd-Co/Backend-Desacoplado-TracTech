// RF68 - Modificar fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF68 
const {modificarFormulaRepositorio} = require('../data/repositorios/formulasRepositorio.js');

/**
 * @function modificarFormula
 * @description Controlador para modificar una fórmula en la base de datos.
 * @param {Object} pet - Objeto de la petición HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 * @returns {Object} Respuesta JSON con el mensaje de éxito o error.
 */
exports.modificarFormula = async (pet, res) => {
    const { id, nombre, formula } = pet.body;
    if (!id || !nombre || !formula) {
        return res.status(400).json({
            mensaje: 'Faltan datos requeridos',
        });
    }
    if (nombre.length > process.env.LONGITUD_MAXIMA_NOMBRE_FORMULA) {
        return res.status(400).json({
            mensaje: 'El nombre no puede exceder los 50 caracteres',
        });
    }
    if (formula.length > process.env.LONGITUD_MAXIMA_FORMULA) {
        return res.status(400).json({
            mensaje: 'La fórmula no puede exceder los 512 caracteres',
        });
    }
    const formulaModificada = await modificarFormulaRepositorio(id, nombre, formula, (err, resultado) => {
        if (err) {
            return res.status(500).json({
                mensaje: 'Error al modificar la fórmula',
            });
        }
        return resultado;
    });
    if (!formulaModificada) {
        return res.status(500).json({
            mensaje: 'Error al guardar los cambios, intentelo más tarde',
        });
    }
    res.status(200).json({
        mensaje: 'Fórmula modificada con éxito',
    });
};
