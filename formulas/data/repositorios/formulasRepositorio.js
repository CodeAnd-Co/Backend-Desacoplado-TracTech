// RF68 - Modificar fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF68 
// RF69 - Guardar fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF69
// RF71 - Eliminar fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF71


const conexion = require('../../../util/bd.js');

/**
 * @function modificarFormulaRepositorio
 * @description Modifica una fórmula en la base de datos.
 * @param {number} id - ID de la fórmula a modificar.
 * @param {string} nombre - Nuevo nombre de la fórmula.
 * @param {string} formula - Nueva fórmula.
 * @returns {Promise} Promesa que se resuelve con el resultado de la consulta.
 */
async function modificarFormulaRepositorio(id, nombre, formula) {
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

/**
 * @function guardarFormulaRepositorio
 * @description Guarda una fórmula en la base de datos.
 * @param {string} nombre - Nombre de la fórmula.
 * @param {string} formula - Datos de la fórmula.
 * @returns {Promise} Promesa que se resuelve con el resultado de la consulta.
 */
async function guardarFormulaRepositorio(nombre, formula) {
    return new Promise((resolver, rechazar) => {
        // Consulta SQL para insertar la fórmula en la base de datos
        // Se utiliza '?' como marcador de posición para evitar inyecciones SQL
        const consulta = 'INSERT INTO formula (Nombre, Datos) VALUES (?, ?)';
        // Ejecuta la consulta
        conexion.query(consulta, [nombre, formula], (err, resultado) => {
            if (err) {
                return rechazar(err);
            }
            resolver(resultado); // Regresa el resultado de la consulta
       
        });

    });
    
}

/**
 * @function eliminarFormulaRepositorio
 * @description Elimina una fórmula de la base de datos.
 * @param {number} id - ID de la fórmula a eliminar.
 * @returns {Promise} Promesa que se resuelve con el resultado de la consulta.
 */
async function eliminarFormulaRepositorio(id) {
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
    modificarFormulaRepositorio,
    guardarFormulaRepositorio,
    eliminarFormulaRepositorio,
};
