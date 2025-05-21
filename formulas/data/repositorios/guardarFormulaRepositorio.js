//
const { guardarFormulaModelo } = require('../modelos/guardarFormulaModelo.js')

async function guardarFormulaRepositorio(nombre, formula) {
    if (nombre.length > process.env.LONGITUD_MAXIMA_NOMBRE_FORMULA) {
        return respuesta.status(400).json({
            mensaje: 'El nombre no puede exceder los 30 caracteres',
        });
    }
    if (formula.length > process.env.LONGITUD_MAXIMA_FORMULA) {
        return respuesta.status(400).json({
            mensaje: 'La fórmula no puede exceder los 512 caracteres',
        });
    }
    const formulaGuardada = await guardarFormulaModelo(nombre, formula, (error, resultado) => {
        if (error) {
            return respuesta.status(500).json({
                mensaje: 'Error de conexión, intente más tarde',
            });
        }
        if (!resultado) {
            return respuesta.status(500).json({
                mensaje: 'Error al guardar la fórmula',
            });
        }
        return resultado;
    });
    if (!formulaGuardada) {
        return respuesta.status(500).json({
            mensaje: 'Error al guardar la fórmula',
        });
    }
}
module.exports = {
    guardarFormulaRepositorio,
};
