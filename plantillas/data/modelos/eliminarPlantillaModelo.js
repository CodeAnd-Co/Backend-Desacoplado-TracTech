const conexion = require('../../../util/servicios/bd.js');

/**
 * @async
 * @function eliminarPlantillaPorTituloModelo
 * @param {string} titulo - Título de la plantilla a eliminar.
 * @description Función para eliminar una plantilla de la base de datos por su título.
 * @returns {Promise<Object>} Promesa que resuelve con el resultado de la eliminación.
 * @throws {Error} Si ocurre un error al ejecutar la consulta.
 */
async function eliminarPlantillaPorTituloModelo(titulo) {
    return new Promise((resolver, rechazar) => {
        // Consulta SQL para eliminar una plantilla por título
        const consulta = 'DELETE FROM plantilla WHERE titulo = ?';
        
        // Ejecuta la consulta
        conexion.query(consulta, [titulo], (err, resultado) => {
            if (err) {
                return rechazar(err);
            }
            resolver(resultado); // Regresa el resultado de la eliminación
        });
    });
}

module.exports = {
    eliminarPlantillaPorTituloModelo,
};
