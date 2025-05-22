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
            status: 400,
            mensaje: 'Faltan datos requeridos',
        };
    }
    
    if (typeof id !== 'number' || typeof nombre !== 'string' || typeof formula !== 'string') {
        return {
            status: 400,
            mensaje: 'Tipo de dato incorrecto',
        };
    }
    if (nombre.length > process.env.LONGITUD_MAXIMA_NOMBRE_FORMULA) {
        return {
            status: 400,
            mensaje: `El nombre no puede tener más de ${process.env.LONGITUD_MAXIMA_NOMBRE_FORMULA} caracteres`,
        };
    }
    if (formula.length > process.env.LONGITUD_MAXIMA_FORMULA) {
        return {
            status: 400,
            mensaje: `La fórmula no puede tener más de ${process.env.LONGITUD_MAXIMA_FORMULA} caracteres`,
        };
    }
    
    try {
        const resultado = await modificarFormulaModelo(id, nombre, formula);
        
        if (!resultado || resultado.affectedRows === 0) {
            return {
                status: 404,
                mensaje: 'No se encontró la fórmula o no se realizaron cambios',
            };
        }

        return {
            status: 200,
            mensaje: 'Fórmula modificada con éxito',
            resultado
        };
    } catch (error) {
        return {
            status: 500,
            mensaje: 'Error de conexión, intente más tarde',
        };
    }
}

module.exports = {
    modificarFormulaRepositorio,
};