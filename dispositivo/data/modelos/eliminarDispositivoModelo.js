const conexion = require('../../../util/servicios/bd');

/**
 * Elimina un dispositivo de la base de datos
 * @param {string} id - ID del dispositivo
 * @returns {Promise<Object>}
 */
function eliminar(id) {
    const consulta = `
        DELETE FROM dispositivos 
        WHERE id = ?
    `;
    return new Promise((resolve, reject) => {
        conexion.execute(consulta, [id], (error, resultado) => {
            if (error) return reject(error);
            resolve(resultado);
        });
    });
}

module.exports = {
    eliminar
};
