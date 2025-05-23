// RF71 - Eliminar fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF71

const { eliminarFormulaRepositorio } = require('../data/repositorios/eliminarFormulaRepositorio');

/**
 * @function eliminarFormula
 * @description Controlador para eliminar una fórmula de la base de datos.
 * @returns {Object} Respuesta JSON con el mensaje de éxito o error.
 */
exports.eliminarFormula = async (peticion, respuesta) => {
    try{
        const { id } = peticion.body;
        if (!id) {
            return respuesta.status(400).json({
                mensaje: 'El id de la fórmula es requerido',
            });
        }
        const idFormula = parseInt(id, 10);
        // Hace la consulta a la base de datos para eliminar la fórmula
        const resultado = await eliminarFormulaRepositorio(idFormula);
        if (resultado && resultado.estado) {
            return respuesta.status(resultado.estado).json({
                mensaje: resultado.mensaje
            });
        }
        
        return respuesta.status(200).json({
            mensaje: 'Fórmula eliminada con éxito',
        });
        
    } catch (error) {
        respuesta.status(500).json({
            mensaje: 'Error interno del servidor, intente más tarde',
        });
    }
    
}


