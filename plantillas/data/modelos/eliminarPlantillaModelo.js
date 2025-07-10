const conexion = require('../../../util/servicios/bd.js');

/**
 * @async
 * @function eliminarPlantillaModelo
 * @param {number} id - ID de la plantilla a eliminar.
 * @description Función para eliminar una plantilla de la base de datos.
 * @returns {Promise<Object>} Promesa que resuelve con el resultado de la eliminación.
 * @throws {Error} Si ocurre un error al ejecutar la consulta.
 */
async function eliminarPlantillaModelo(id) {
    return new Promise((resolver, rechazar) => {
        // Consulta SQL para eliminar una plantilla por ID
        const consulta = 'DELETE FROM plantilla WHERE id = ?';
        
        // Ejecuta la consulta
        conexion.query(consulta, [id], (err, resultado) => {
            if (err) {
                return rechazar(err);
            }
            resolver(resultado); // Regresa el resultado de la eliminación
        });
    });
}

module.exports = {
    eliminarPlantillaModelo,
};
