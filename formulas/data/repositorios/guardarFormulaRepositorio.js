// RF69 - Guardar fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF69

const { guardarFormulaModelo } = require('../modelos/guardarFormulaModelo.js')

async function guardarFormulaRepositorio(nombre, formula) {
    if (!nombre || !formula) {
        return {
            estado: 400,
            mensaje: 'Faltan datos requeridos',
        };
    }
    if (nombre.length > process.env.LONGITUD_MAXIMA_NOMBRE_FORMULA) {
        return {
            estado: 400,
            mensaje: 'El nombre no puede exceder los 30 caracteres',
        };
    }
    if (formula.length > process.env.LONGITUD_MAXIMA_FORMULA) {
        return {
            estado: 400,
            mensaje: 'La fórmula no puede exceder los 512 caracteres',
        };
    }
    try{
        await guardarFormulaModelo(nombre, formula, (error, resultado) => {
            if (!resultado || resultado.affectedRows === 0) {
                return {
                    estado: 404,
                    mensaje: 'No se encontró la fórmula o no se realizaron cambios',
                };
            }
            if (error) {
                return {
                    estado: 500,
                    mensaje: 'Error de conexión, intente más tarde',
                };
            }
            return {
                estado: 200,
                mensaje: 'Fórmula guardada con éxito',
                resultado
            };
        });
    } catch (error) {
        return {
            estado: 500,
            mensaje: 'Error interno del servidor, intente más tarde',
        };
    }
    
}
module.exports = {
    guardarFormulaRepositorio,
};
