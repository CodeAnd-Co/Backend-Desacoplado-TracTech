// RF68 - Modificar fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF68 

const conexion = require('../../../util/servicios/bd.js');

/**
 * @function modificarFormulaModelo
 * @description Modifica una fórmula en la base de datos.
 * @param {number} id - ID de la fórmula a modificar.
 * @param {string} nombre - Nuevo nombre de la fórmula.
 * @param {string} formula - Nueva fórmula.
 * @returns {Promise} Promesa que se resuelve con el resultado de la consulta.
 */
async function modificarFormulaModelo(id, nombre, formula) {
    return new Promise((resolver, rechazar) => {
        const consulta = 'UPDATE formula SET Nombre = ?, Datos = ? WHERE idFormula = ?';
        conexion.query(consulta, [nombre, formula, id], (err, resultado) => {
            if (err) {
                return rechazar(err);
            }
            resolver(resultado);
        });
    });
}

module.exports = {
    modificarFormulaModelo
};
