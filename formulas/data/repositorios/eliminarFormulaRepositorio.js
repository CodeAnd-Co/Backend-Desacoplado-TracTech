//
const { eliminarFormulaModelo } = require('../modelos/eliminarFormulaModelo.js');

async function eliminarFormulaRepositorio(id) {
    if (!id) {
        return {
            status: 400,
            mensaje: 'El id de la fórmula es requerido',
        };
    }
    if (isNaN(id)) {
        return {
            status: 400,
            mensaje: 'El id de la fórmula debe ser un número',
        };
    }
    try{
        const resultado = await eliminarFormulaModelo(id);
        if (!resultado || resultado.affectedRows === 0) {
            return {
                status: 404,
                mensaje: 'No se encontró la fórmula o no se realizaron cambios',
                resultado
            };
        }
        return {
            status: 200,
            mensaje: 'Fórmula eliminada con éxito',
            resultado
        };
    } catch (error) {
        return {
            status: 500,
            mensaje: 'Error interno del servidor, intente más tarde',
        };
    }
}

module.exports = {
    eliminarFormulaRepositorio,
};