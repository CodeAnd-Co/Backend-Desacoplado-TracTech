// RF76 - Consulta fórmulas - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF76
const { consultarFormulaModelo } = require('../modelos/consultarFormulaModelo.js');

async function consultarFormulaRepositorio() {
    const datos = await consultarFormulaModelo((error, resultado) => {
        if (error) {
            return error;
        }
        return resultado;
    });
    if (!datos) {
        return {
            mensaje: 'Error al consultar las fórmulas: no se encontraron fórmulas',
        };
    }
    return datos;
}

module.exports = {
    consultarFormulaRepositorio,
};