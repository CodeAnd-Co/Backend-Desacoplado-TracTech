// RF76 - Consulta fórmulas - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF76
const conexion = require('../../../util/servicios/bd.js');
/**
 * @async
 * @function consultarFormulaModelo
 * @description Función para consultar todas las fórmulas de la base de datos.
 * @returns {Promise<Object>} Promesa que resuelve con el resultado de la consulta.
 * @throws {Error} Si ocurre un error al ejecutar la consulta.
 */
async function consultarFormulaModelo() {
    return new Promise((resolver, rechazar) => {
        // Consulta SQL para obtener todas las fórmulas de la base de datos
        const consulta = 'SELECT * FROM formula';
        // Ejecuta la consulta
        conexion.query(consulta, (err, resultado) => {
            if (err) {
                return rechazar(err);
            }
            resolver(resultado); // Regresa el resultado de la consulta
        });
    });
}

module.exports = {
    consultarFormulaModelo,
};