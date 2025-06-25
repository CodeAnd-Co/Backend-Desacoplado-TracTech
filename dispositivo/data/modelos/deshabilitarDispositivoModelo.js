const conexion = require('../../../util/servicios/bd');

/**
 * Deshabilita un dispositivo en la base de datos y lo desvincula del usuario
 * @param {string} id - ID del dispositivo
 * @returns {Promise<Object>}
 */
function deshabilitar(id) {
    const consulta = `
        UPDATE dispositivos 
        SET estado = FALSE, id_usuario_FK = NULL
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
    deshabilitar
};
