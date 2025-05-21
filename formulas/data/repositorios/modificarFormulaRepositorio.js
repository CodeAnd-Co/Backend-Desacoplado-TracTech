//
const { modificarFormulaModelo } = require('../modelos/modificarFormulaModelo.js'); 

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
    await modificarFormulaModelo(id, nombre, formula, (error, resultado) => {
        if (error) {
            return resultado.status(500).json({
                mensaje: 'Error de conexión, intente más tarde:' + error,
            });
        }
        if (!resultado) {
            return resultado.status(500).json({
                mensaje: 'Error al guardar la fórmula',
            });
        }
        return resultado;
    });
    
}


module.exports = {
    modificarFormulaRepositorio,
};