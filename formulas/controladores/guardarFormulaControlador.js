// RF67 - Guardar fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF67
const { guardarFormulaRepositorio } = require('../data/repositorios/formulasRepositorio.js');

// Función para guardar una fórmula en la base de datos
exports.guardarFormula = async (pet, res) => {
    // Recibe los datos desde el cuerpo de la petición
    const {nombre, formula} = pet.body;
    // Verifica si se recibieron los datos necesarios
    if (!formula || !nombre) {
        return res.status(400).json({
            mensaje: 'Faltan datos requeridos',
        });
    }
    if (nombre.length > process.env.LONGITUD_MAXIMA_NOMBRE_FORMULA) {
        return res.status(400).json({
            mensaje: 'El nombre no puede exceder los 30 caracteres',
        });
    }
    if (formula.length > process.env.LONGITUD_MAXIMA_FORMULA) {
        return res.status(400).json({
            mensaje: 'La fórmula no puede exceder los 512 caracteres',
        });
    }
    // Hace la consulta a la base de datos para guardar la fórmula
    const formulaGuardada = await guardarFormulaRepositorio(nombre, formula, (err, resultado) => {
        if (err) {
            return res.status(500).json({
                mensaje: 'Error al guardar la fórmula',
            });
        }
        return resultado;
    });
    // Verifica si la fórmula fue guardada correctamente
    if (!formulaGuardada) {
        return res.status(500).json({
            mensaje: 'Error al guardar la fórmula',
        });
    }
    // Mensaje de éxito
    res.status(200).json({
        mensaje: 'Fórmula guardada con éxito',
    });

}