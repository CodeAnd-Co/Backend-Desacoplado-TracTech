// RF69 - Guardar fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF69
const conexion = require('../../../util/servicios/bd.js');


/**
 * @function guardarFormulaModelo
 * @description Guarda una fórmula en la base de datos.
 * @param {string} nombre - Nombre de la fórmula.
 * @param {string} formula - Datos de la fórmula.
 * @returns {Promise} Promesa que se resuelve con el resultado de la consulta.
 */
async function guardarFormulaModelo(nombre, formula) {
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

module.exports = {
    guardarFormulaModelo,
};