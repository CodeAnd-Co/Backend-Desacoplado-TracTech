// RF71 - Eliminar una fórmula - http....
const { eliminarFormulaRepositorio } = require('../data/repositorios/formulasRepositorio.js');

// Función para eliminar una fórmula de la base de datos
exports.eliminarFormula = async (peticion, respuesta) => {
    const { id } = peticion.body;
    if (!id) {
        return respuesta.status(400).json({
            mensaje: 'El id de la fórmula es requerido',
        });
    }
    if (isNaN(id)) {
        return respuesta.status(400).json({
            mensaje: 'El id de la fórmula debe ser un número',
        });
    }
    // Hace la consulta a la base de datos para eliminar la fórmula
    const formulaEliminada = await eliminarFormulaRepositorio(id, (err, resultado) => {
        if (err) {
            return respuesta.status(500).json({
                mensaje: 'Error al eliminar la fórmula',
            });
        }
        return resultado;
    }); 
    // Verifica si la fórmula fue eliminada correctamente
    if (!formulaEliminada) {
        return respuesta.status(500).json({
            mensaje: 'Error al eliminar la fórmula',
        });
    } else if (formulaEliminada.affectedRows === 0) {
        return respuesta.status(404).json({
            mensaje: 'La fórmula a eliminar no existe',
        });
    }


    // Mensaje de éxito
    respuesta.status(200).json({
        mensaje: 'Fórmula eliminada con éxito',
    });
}


