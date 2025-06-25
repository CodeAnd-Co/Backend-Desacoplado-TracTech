const conexion = require('../../../util/servicios/bd');

/**
 * Vincula un dispositivo a un usuario
 * @param {string} dispositivoId - ID del dispositivo
 * @param {number} idUsuario - ID del usuario
 * @returns {Promise<Object>}
 */
function vincularDispositivo(dispositivoId, idUsuario) {
    const consulta = `
        UPDATE dispositivos 
        SET id_usuario_FK = ?
        WHERE id = ?
    `;
    return new Promise((resolve, reject) => {
        conexion.execute(consulta, [idUsuario, dispositivoId], (error, resultado) => {
            if (error) return reject(error);
            resolve(resultado);
        });
    });
}

/**
 * Libera todos los dispositivos vinculados a un usuario
 * @param {number} idUsuario - ID del usuario
 * @returns {Promise<Object>}
 */
function liberarDispositivosDeUsuario(idUsuario) {
    const consulta = `
        UPDATE dispositivos 
        SET id_usuario_FK = NULL
        WHERE id_usuario_FK = ?
    `;
    return new Promise((resolve, reject) => {
        conexion.execute(consulta, [idUsuario], (error, resultado) => {
            if (error) return reject(error);
            resolve(resultado);
        });
    });
}

/**
 * Verifica si un usuario existe en la base de datos
 * @param {number} idUsuario - ID del usuario
 * @returns {Promise<boolean>}
 */
function verificarUsuarioExiste(idUsuario) {
    const consulta = `
        SELECT idUsuario FROM usuario WHERE idUsuario = ?
    `;
    return new Promise((resolve, reject) => {
        conexion.execute(consulta, [idUsuario], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados.length > 0);
        });
    });
}

module.exports = {
    vincularDispositivo,
    liberarDispositivosDeUsuario,
    verificarUsuarioExiste
};
