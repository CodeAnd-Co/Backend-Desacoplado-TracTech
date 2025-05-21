//
const { eliminarFormulaModelo } = require('../modelos/eliminarFormulaModelo.js');

async function eliminarFormulaRepositorio(id) {
    if (isNaN(id)) {
        return respuesta.status(400).json({
            mensaje: 'El id de la fórmula debe ser un número',
        });
    }
    const formulaEliminada = await eliminarFormulaModelo(id, (error, resultado) => {
        if (error) {
            return respuesta.status(500).json({
                mensaje: 'Error de conexión, intente más tarde',
            });
        }
        if (resultado.affectedRows === 0) {
            return respuesta.status(404).json({
                mensaje: 'La fórmula a eliminar no existe',
            });
        }
        if (!resultado) {
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
}

module.exports = {
    eliminarFormulaRepositorio,
};