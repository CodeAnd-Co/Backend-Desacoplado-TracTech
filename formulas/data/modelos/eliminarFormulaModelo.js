// RF71 - Eliminar fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF71
const conexion = require('../../../util/servicios/bd.js');



/**
 * @function eliminarFormulaModelo
 * @description Elimina una fórmula de la base de datos.
 * @param {number} id - ID de la fórmula a eliminar.
 * @returns {Promise} Promesa que se resuelve con el resultado de la consulta.
 */
async function eliminarFormulaModelo(id) {
    return new Promise((resolver, rechazar) => {
        // Consulta SQL para eliminar la fórmula de la base de datos
        const consulta = 'DELETE FROM formula WHERE idFormula = ?';
        // Ejecuta la consulta
        conexion.query(consulta, [id], (err, resultado) => {
            if (err) {
                return rechazar(err);
            }
            resolver(resultado); // Regresa el resultado de la consulta
        });
    });
}

module.exports = {
    eliminarFormulaModelo,
};
