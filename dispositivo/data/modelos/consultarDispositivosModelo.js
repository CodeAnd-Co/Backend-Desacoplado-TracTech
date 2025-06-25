const conexion = require('../../../util/servicios/bd');

/**
 * Obtiene un dispositivo por su ID desde la base de datos
 * @param {string} id - ID del dispositivo
 * @returns {Promise<Object|null>}
 */
function obtenerPorId(id) {
    const consulta = `
        SELECT id, estado, id_usuario_FK
        FROM dispositivos 
        WHERE id = ?
    `;
    return new Promise((resolve, reject) => {
        conexion.execute(consulta, [id], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados.length > 0 ? resultados[0] : null);
        });
    });
}

/**
 * Obtiene todos los dispositivos de la base de datos con información del usuario
 * @returns {Promise<Array>}
 */
function obtenerTodos() {
    const consulta = `
        SELECT d.id, d.estado, d.id_usuario_FK, u.Nombre as nombre_usuario
        FROM dispositivos d
        LEFT JOIN usuario u ON d.id_usuario_FK = u.idUsuario
        ORDER BY d.id
    `;
    return new Promise((resolve, reject) => {
        conexion.execute(consulta, [], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados);
        });
    });
}

/**
 * Obtiene dispositivos filtrados por estado
 * @param {boolean} estado - true para activos, false para inactivos
 * @returns {Promise<Array>}
 */
function obtenerPorEstado(estado) {
    const consulta = `
        SELECT id, estado, id_usuario_FK
        FROM dispositivos 
        WHERE estado = ?
        ORDER BY id
    `;
    return new Promise((resolve, reject) => {
        conexion.execute(consulta, [estado], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados);
        });
    });
}

/**
 * Obtiene dispositivos vinculados a un usuario específico
 * @param {number} idUsuario - ID del usuario
 * @returns {Promise<Array>}
 */
function obtenerDispositivosDeUsuario(idUsuario) {
    const consulta = `
        SELECT id, estado, id_usuario_FK
        FROM dispositivos 
        WHERE id_usuario_FK = ?
    `;
    return new Promise((resolve, reject) => {
        conexion.execute(consulta, [idUsuario], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados);
        });
    });
}

/**
 * Obtiene todas las vinculaciones con información de usuario
 * @returns {Promise<Array>}
 */
function obtenerVinculaciones() {
    const consulta = `
        SELECT d.id, d.estado, d.id_usuario_FK,
        u.nombre as nombre_usuario, u.correo as correo_usuario
        FROM dispositivos d
        LEFT JOIN usuario u ON d.id_usuario_FK = u.idUsuario
    `;
    return new Promise((resolve, reject) => {
        conexion.execute(consulta, [], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados);
        });
    });
}

/**
 * Verifica si un usuario ya tiene dispositivos vinculados
 * @param {number} idUsuario - ID del usuario
 * @returns {Promise<number>}
 */
function contarDispositivosDeUsuario(idUsuario) {
    const consulta = `
        SELECT COUNT(*) as total
        FROM dispositivos 
        WHERE id_usuario_FK = ?
    `;
    return new Promise((resolve, reject) => {
        conexion.execute(consulta, [idUsuario], (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados[0].total);
        });
    });
}

module.exports = {
    obtenerPorId,
    obtenerTodos,
    obtenerPorEstado,
    obtenerDispositivosDeUsuario,
    obtenerVinculaciones,
    contarDispositivosDeUsuario
};
