// RF69 - Guardar fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF69
const { guardarFormulaRepositorio } = require('../data/repositorios/guardarFormulaRepositorio.js');


/**
 * @function guardarFormula
 * @description Controlador para guardar una fórmula en la base de datos.
 * @param {Object} pet - Objeto de la petición HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 * @returns {Object} Respuesta JSON con el mensaje de éxito o error.
 */
exports.guardarFormula = async (pet, res) => {
    try{
        // Recibe los datos desde el cuerpo de la petición
    const {nombre, formula} = pet.body;
    // Verifica si se recibieron los datos necesarios
    if (!formula || !nombre) {
        return res.status(400).json({
            mensaje: 'Faltan datos requeridos',
        });
    }
    
    const resultado = await guardarFormulaRepositorio(nombre, formula);
    if (resultado && resultado.estado) {
        return res.status(resultado.estado).json({
            mensaje: resultado.mensaje
        });
    }
    return res.status(200).json({
        mensaje: 'Fórmula guardada con éxito',
    });

    } catch (error) {
        return res.status(500).json({
            mensaje: 'Error interno del servidor, intente más tarde',
        });
    }
    
}