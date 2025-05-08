// RF71 - Eliminar una fórmula - http....
const conexion = require('../../util/bd.js');

// Función para eliminar una fórmula de la base de datos
exports.eliminarFormula = async (peticion, respuesta) => {
    const { id } = peticion.body;
    if (!id) {
        return respuesta.status(400).json({
            mensaje: 'Faltan datos requeridos',
        });
    }
    // Hace la consulta a la base de datos para eliminar la fórmula
    const formulaEliminada = await eliminarFormula(id, (err, resultado) => {
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
            mensaje: 'La fórmula no existe',
        });
    }


    // Mensaje de éxito
    respuesta.status(200).json({
        mensaje: 'Fórmula eliminada con éxito',
    });
}

async function eliminarFormula(id) {
    return new Promise((resolver, rechazar) => {
        // Consulta SQL para eliminar la fórmula de la base de datos
        const consulta = 'DELETE FROM formula WHERE idFormula = ?';
        // Ejecuta la consulta
        conexion.query(consulta, [id], (err, resultado) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                return rechazar(err);
            }
            resolver(resultado); // Regresa el resultado de la consulta
        });
    });
}
