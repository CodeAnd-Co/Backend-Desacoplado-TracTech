// RF71 - Eliminar una fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF71

const { eliminarFormulaModelo } = require('../modelos/eliminarFormulaModelo.js');

async function eliminarFormulaRepositorio(id) {
    if (!id) {
        return {
            estado: 400,
            mensaje: 'El id de la fórmula es requerido',
        };
    }
    if (isNaN(id)) {
        return {
            estado: 400,
            mensaje: 'El id de la fórmula debe ser un número',
        };
    }
    try{
        const resultado = await eliminarFormulaModelo(id);
        if (!resultado || resultado.affectedRows === 0) {
            return {
                estado: 404,
                mensaje: 'No se encontró la fórmula o no se realizaron cambios',
                resultado
            };
        }
        return {
            estado: 200,
            mensaje: 'Fórmula eliminada con éxito',
            resultado
        };
    } catch (error) {
        return {
            estado: 500,
            mensaje: `Error interno del servidor, intente más tarde: ${error}`,
        };
    }
}

module.exports = {
    eliminarFormulaRepositorio,
};