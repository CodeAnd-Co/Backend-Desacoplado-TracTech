const conexion = require('../../../util/servicios/bd.js');

/**
 * @async
 * @function consultarPlantillaPorTituloModelo
 * @param {string} titulo - Título de la plantilla a consultar.
 * @description Función para consultar una plantilla específica por su título.
 * @returns {Promise<Object>} Promesa que resuelve con el resultado de la consulta.
 * @throws {Error} Si ocurre un error al ejecutar la consulta.
 */
async function consultarPlantillaPorTituloModelo(titulo) {
    return new Promise((resolver, rechazar) => {
        // Consulta SQL para obtener una plantilla específica por título
        const consulta = 'SELECT * FROM plantilla WHERE titulo = ?';
        
        // Ejecuta la consulta
        conexion.query(consulta, [titulo], (err, resultado) => {
            if (err) {
                return rechazar(err);
            }
            resolver(resultado); // Regresa el resultado de la consulta
        });
    });
}

module.exports = {
    consultarPlantillaPorTituloModelo,
};
