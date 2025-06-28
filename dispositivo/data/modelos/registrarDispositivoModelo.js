const conexion = require('../../../util/servicios/bd');

/**
 * Registra un nuevo dispositivo o actualiza uno existente en la base de datos
 * @param {string} id - ID del dispositivo
 * @param {number|null} idUsuario - ID del usuario que registra el dispositivo
 * @returns {Promise<Object>}
 */
function registrarOActualizar(id, idUsuario = null) {
    const consulta = `
        INSERT INTO dispositivos (id, estado, id_usuario_FK) 
        VALUES (?, TRUE, ?)
        ON DUPLICATE KEY UPDATE 
            id_usuario_FK = CASE 
                WHEN id_usuario_FK IS NULL AND VALUES(id_usuario_FK) IS NOT NULL 
                THEN VALUES(id_usuario_FK) 
                ELSE id_usuario_FK 
            END,
            estado = TRUE
    `;
    return new Promise((resolve, reject) => {
        conexion.execute(consulta, [id, idUsuario], (error, resultado) => {
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
    registrarOActualizar,
    verificarUsuarioExiste
};
