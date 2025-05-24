// RF68 - Modificar fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF68 

const { modificarFormulaModelo } = require('../modelos/modificarFormulaModelo.js'); 

/**
 * @function modificarFormulaRepositorio
 * @description Repositorio para modificar una fórmula
 * @param {number} id - ID de la fórmula a modificar
 * @param {string} nombre - Nuevo nombre de la fórmula
 * @param {string} formula - Nueva fórmula
 * @returns {Promise<Object>} Objeto con el resultado de la operación
 */
async function modificarFormulaRepositorio(id, nombre, formula) {
    if (!id || !nombre || !formula) {
        return {
            estado: 400,
            mensaje: 'Faltan datos requeridos',
        };
    }
    
    if (typeof id !== 'number' || typeof nombre !== 'string' || typeof formula !== 'string') {
        return {
            estado: 400,
            mensaje: 'Tipo de dato incorrecto',
        };
    }
    if (nombre.length > process.env.LONGITUD_MAXIMA_NOMBRE_FORMULA) {
        return {
            estado: 400,
            mensaje: `El nombre no puede tener más de ${process.env.LONGITUD_MAXIMA_NOMBRE_FORMULA} caracteres`,
        };
    }
    if (formula.length > process.env.LONGITUD_MAXIMA_FORMULA) {
        return {
            estado: 400,
            mensaje: `La fórmula no puede tener más de ${process.env.LONGITUD_MAXIMA_FORMULA} caracteres`,
        };
    }
    
    try {
        const resultado = await modificarFormulaModelo(id, nombre, formula);
        
        if (!resultado || resultado.affectedRows === 0) {
            return {
                estado: 404,
                mensaje: 'No se encontró la fórmula o no se realizaron cambios',
            };
        }

        return {
            estado: 200,
            mensaje: 'Fórmula modificada con éxito',
            resultado
        };
    } catch (error) {
        return {
            estado: 500,
            mensaje: `Error de conexión, intente más tarde: ${error}`,
        };
    }
}

module.exports = {
    modificarFormulaRepositorio,
};