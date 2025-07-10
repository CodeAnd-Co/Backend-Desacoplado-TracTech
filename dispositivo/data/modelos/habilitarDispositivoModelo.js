const conexion = require('../../../util/servicios/bd');

/**
 * Habilita un dispositivo en la base de datos
 * @param {string} id - ID del dispositivo
 * @returns {Promise<Object>}
 */
function habilitar(id) {
    const consulta = `
        UPDATE dispositivos 
        SET estado = TRUE
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
    habilitar
};
