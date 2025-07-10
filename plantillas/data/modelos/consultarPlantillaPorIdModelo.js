const conexion = require('../../../util/servicios/bd.js');

/**
 * @async
 * @function consultarPlantillaPorIdModelo
 * @param {number} id - ID de la plantilla a consultar.
 * @description Función para consultar una plantilla específica por su ID.
 * @returns {Promise<Object>} Promesa que resuelve con el resultado de la consulta.
 * @throws {Error} Si ocurre un error al ejecutar la consulta.
 */
async function consultarPlantillaPorIdModelo(id) {
    return new Promise((resolver, rechazar) => {
        // Consulta SQL para obtener una plantilla específica por ID
        const consulta = 'SELECT * FROM plantilla WHERE id = ?';
        
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
    consultarPlantillaPorIdModelo,
};
