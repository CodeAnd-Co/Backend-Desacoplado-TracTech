// RF71 - Eliminar fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF71

const { eliminarFormulaModelo } = require('../data/modelos/eliminarFormulaModelo.js');

/**
 * @function eliminarFormula
 * @description Controlador para eliminar una fórmula de la base de datos.
 * @returns {Object} Respuesta JSON con el mensaje de éxito o error.
 */
exports.eliminarFormula = async (peticion, respuesta) => {
    const { id } = peticion.body;
    if (!id) {
        return respuesta.status(400).json({
            mensaje: 'El id de la fórmula es requerido',
        });
    }
    // Hace la consulta a la base de datos para eliminar la fórmula
    const formulaEliminada = await eliminarFormulaModelo(id, (err, resultado) => {
        if (err) {
            return respuesta.status(500).json({
                mensaje: 'Error al eliminar la fórmula',
            });
        }
        return resultado;
    }); 
    if (!formulaEliminada) {
        return respuesta.status(500).json({
            mensaje: 'Error al eliminar la fórmula',
        });
    }

    // Mensaje de éxito
    respuesta.status(200).json({
        mensaje: 'Fórmula eliminada con éxito',
    });
}


