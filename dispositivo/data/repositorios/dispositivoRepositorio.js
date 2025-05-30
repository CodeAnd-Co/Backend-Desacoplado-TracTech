// dispositivo/data/repositorios/dispositivoRepositorio.js

const DispositivoModelo = require('../modelos/dispositivoModelo');
const conexion = require('../../../util/servicios/bd');

/**
 * Repositorio para manejar operaciones CRUD de dispositivos con MySQL
 */
class DispositivoRepositorio {
      /**
     * Obtiene un dispositivo por su ID desde la base de datos
     * @param {string} id - ID del dispositivo
     * @returns {DispositivoModelo|null}
     */
    static async obtenerPorId(id) {
        return new Promise((resolve, reject) => {
            try {
                const query = `
                    SELECT id, estado, id_usuario_FK
                    FROM dispositivos 
                    WHERE id = ?
                `;
                
                conexion.execute(query, [id], (error, resultados) => {
                    if (error) {
                        return reject(new Error('Error al acceder a la base de datos'));
                    }
                    
                    if (resultados.length === 0) {
                        return resolve(null);
                    }
                    
                    const fila = resultados[0];
                    // Convertir explícitamente el estado de MySQL (0/1) a boolean
                    const dispositivo = new DispositivoModelo(
                        fila.id, 
                        Boolean(fila.estado),
                        fila.id_usuario_FK,
                        fila.fecha_vinculacion,
                        fila.fecha_registro,
                        fila.fecha_ultima_actividad,
                        fila.metadata
                    );
                    
                    resolve(dispositivo);
                });
            } catch {
                reject(new Error('Error al acceder a la base de datos'));
            }
        });
    }
    /**
     * Registra un nuevo dispositivo o actualiza uno existente en la base de datos
     * @param {string} id - ID del dispositivo
     * @param {number|null} idUsuario - ID del usuario que registra el dispositivo
     * @returns {DispositivoModelo}
     */
    static async registrarOActualizar(id, idUsuario = null) {
        return new Promise((resolve, reject) => {
            try {
                // Si se proporciona un idUsuario, verificar que existe primero
                if (idUsuario) {
                    const verificarUsuarioQuery = `
                        SELECT idUsuario FROM usuario WHERE idUsuario = ?
                    `;
                    
                    conexion.execute(verificarUsuarioQuery, [idUsuario], (error, resultados) => {
                        if (error) {
                            return reject(new Error('Error al acceder a la base de datos'));
                        }
                        
                        if (resultados.length === 0) {
                            // Continuar sin vinculación
                            this._ejecutarRegistroOActualizacion(id, null, resolve, reject);
                        } else {
                            // Usuario existe, proceder con vinculación
                            this._ejecutarRegistroOActualizacion(id, idUsuario, resolve, reject);
                        }
                    });
                } else {
                    // No hay usuario, proceder sin vinculación
                    this._ejecutarRegistroOActualizacion(id, null, resolve, reject);
                }
            } catch {
                reject(new Error('Error al acceder a la base de datos'));
            }
        });
    }

    /**
     * Método privado para ejecutar el registro o actualización
     * @private
     */
    static _ejecutarRegistroOActualizacion(id, idUsuario, resolve, reject) {
        const query = `
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
        
        conexion.execute(query, [id, idUsuario], (error) => {
            if (error) {
                return reject(new Error('Error al acceder a la base de datos'));
            }
            
            // Obtener el dispositivo actualizado desde la base de datos
            this.obtenerPorId(id)
                .then(dispositivo => {
                    if (dispositivo) {
                        resolve(dispositivo);
                    } else {
                        // Si por alguna razón no se encuentra, crear uno nuevo activo
                        resolve(new DispositivoModelo(id, true, idUsuario));
                    }
                })
                .catch(err => reject(err));
        });
    }
    /**
     * Habilita un dispositivo en la base de datos
     * @param {string} id - ID del dispositivo
     * @returns {DispositivoModelo}
     */
    static async habilitar(id) {
        return new Promise((resolve, reject) => {
            try {
                const query = `
                    UPDATE dispositivos 
                    SET estado = TRUE
                    WHERE id = ?
                `;
                
                conexion.execute(query, [id], (error, resultado) => {
                    if (error) {
                        return reject(new Error('Error al acceder a la base de datos'));
                    }
                    
                    if (resultado.affectedRows === 0) {
                        return reject(new Error('Dispositivo no encontrado'));
                    }
                    
                    const dispositivo = new DispositivoModelo(id, true);
                    resolve(dispositivo);
                });
            } catch {
                reject(new Error('Error al acceder a la base de datos'));
            }
        });
    }    /**
     * Deshabilita un dispositivo en la base de datos y lo desvincula del usuario
     * @param {string} id - ID del dispositivo
     * @returns {DispositivoModelo}
     */
    static async deshabilitar(id) {
        return new Promise((resolve, reject) => {
            try {
                const query = `
                    UPDATE dispositivos 
                    SET estado = FALSE, id_usuario_FK = NULL
                    WHERE id = ?
                `;
                
                conexion.execute(query, [id], (error, resultado) => {
                    if (error) {
                        return reject(new Error('Error al acceder a la base de datos'));
                    }
                    
                    if (resultado.affectedRows === 0) {
                        return reject(new Error('Dispositivo no encontrado'));
                    }
                    
                    // Dispositivo deshabilitado y desvinculado
                    const dispositivo = new DispositivoModelo(id, false, null);
                    resolve(dispositivo);
                });
            } catch {
                reject(new Error('Error al acceder a la base de datos'));
            }
        });
    }/**
     * Obtiene todos los dispositivos de la base de datos
     * @returns {DispositivoModelo[]}
     */
    static async obtenerTodos() {
        return new Promise((resolve, reject) => {
            try {
                const query = `
                    SELECT id, estado, id_usuario_FK
                    FROM dispositivos 
                    ORDER BY id
                `;
                
                conexion.execute(query, [], (error, resultados) => {
                    if (error) {
                        return reject(new Error('Error al acceder a la base de datos'));
                    }
                    
                    const dispositivos = resultados.map(fila => 
                        new DispositivoModelo(
                            fila.id, 
                            Boolean(fila.estado),
                            fila.id_usuario_FK
                        ));
                    
                    resolve(dispositivos);
                });
            } catch {
                reject(new Error('Error al acceder a la base de datos'));
            }
        });
    }    /**
     * Obtiene dispositivos filtrados por estado
     * @param {boolean} estado - true para activos, false para inactivos
     * @returns {DispositivoModelo[]}
     */
    static async obtenerPorEstado(estado) {
        return new Promise((resolve, reject) => {
            try {
                const query = `
                    SELECT id, estado, id_usuario_FK
                    FROM dispositivos 
                    WHERE estado = ?
                    ORDER BY id
                `;
                
                conexion.execute(query, [estado], (error, resultados) => {
                    if (error) {
                        return reject(new Error('Error al acceder a la base de datos'));
                    }
                    
                    const dispositivos = resultados.map(fila => 
                        new DispositivoModelo(
                            fila.id, 
                            Boolean(fila.estado),
                            fila.id_usuario_FK,
                        ));
                    
                    resolve(dispositivos);
                });
            } catch {
                reject(new Error('Error al acceder a la base de datos'));
            }
        });
    }

    /**
     * Elimina un dispositivo de la base de datos
     * @param {string} id - ID del dispositivo
     * @returns {boolean} - true si se eliminó correctamente
     */
    static async eliminar(id) {
        return new Promise((resolve, reject) => {
            try {
                const query = `
                    DELETE FROM dispositivos 
                    WHERE id = ?
                `;
                
                conexion.execute(query, [id], (error, resultado) => {
                    if (error) {
                        return reject(new Error('Error al acceder a la base de datos'));
                    }
                    
                    resolve(resultado.affectedRows > 0);
                });
            } catch {
                reject(new Error('Error al acceder a la base de datos'));
            }
        });
    }    /**
     * Vincula un dispositivo a un usuario (sin cambiar su estado)
     * @param {string} dispositivoId - ID del dispositivo
     * @param {number} idUsuario - ID del usuario
     * @returns {DispositivoModelo}
     */
    static async vincularDispositivo(dispositivoId, idUsuario) {
        return new Promise((resolve, reject) => {
            try {
                // Primero verificar que el usuario existe
                const verificarUsuarioQuery = `
                    SELECT idUsuario FROM usuario WHERE idUsuario = ?
                `;
                
                conexion.execute(verificarUsuarioQuery, [idUsuario], (error, resultados) => {
                    if (error) {
                        return reject(new Error('Error al acceder a la base de datos'));
                    }
                    
                    if (resultados.length === 0) {
                        return reject(new Error(`Usuario con ID ${idUsuario} no encontrado`));
                    }
                    
                    // Si el usuario existe, proceder con la vinculación
                    const query = `
                        UPDATE dispositivos 
                        SET id_usuario_FK = ?
                        WHERE id = ?
                    `;
                    
                    conexion.execute(query, [idUsuario, dispositivoId], (error, resultado) => {
                        if (error) {
                            return reject(new Error('Error al acceder a la base de datos'));
                        }
                        
                        if (resultado.affectedRows === 0) {
                            return reject(new Error('Dispositivo no encontrado'));
                        }
                        
                        // Obtener el dispositivo actualizado
                        this.obtenerPorId(dispositivoId)
                            .then(dispositivo => resolve(dispositivo))
                            .catch(err => reject(err));
                    });
                });
            } catch {
                reject(new Error('Error al acceder a la base de datos'));
            }
        });
    }

    /**
     * Libera todos los dispositivos vinculados a un usuario
     * @param {number} idUsuario - ID del usuario
     * @returns {number} - Cantidad de dispositivos liberados
     */
    static async liberarDispositivosDeUsuario(idUsuario) {
        return new Promise((resolve, reject) => {
            try {
                const query = `
                    UPDATE dispositivos 
                    SET id_usuario_FK = NULL
                    WHERE id_usuario_FK = ?
                `;
                
                conexion.execute(query, [idUsuario], (error, resultado) => {
                    if (error) {
                        return reject(new Error('Error al acceder a la base de datos'));
                    }
                    
                    resolve(resultado.affectedRows);
                });
            } catch {
                reject(new Error('Error al acceder a la base de datos'));
            }
        });
    }

    /**
     * Obtiene dispositivos vinculados a un usuario específico
     * @param {number} idUsuario - ID del usuario
     * @returns {DispositivoModelo[]}
     */
    static async obtenerDispositivosDeUsuario(idUsuario) {
        return new Promise((resolve, reject) => {
            try {
                const query = `
                    SELECT id, estado, id_usuario_FK
                    FROM dispositivos 
                    WHERE id_usuario_FK = ?
                `;
                
                conexion.execute(query, [idUsuario], (error, resultados) => {
                    if (error) {
                        return reject(new Error('Error al acceder a la base de datos'));
                    }
                    
                    const dispositivos = resultados.map(fila => 
                        new DispositivoModelo(
                            fila.id, 
                            Boolean(fila.estado),
                            fila.id_usuario_FK,
                            fila.fecha_vinculacion,
                            fila.fecha_registro,
                            fila.fecha_ultima_actividad,
                            fila.metadata
                        ));
                    
                    resolve(dispositivos);
                });
            } catch {
                reject(new Error('Error al acceder a la base de datos'));
            }
        });
    }

    /**
     * Obtiene todas las vinculaciones con información de usuario
     * @returns {Array} - Array con dispositivos y datos de usuario
     */
    static async obtenerVinculaciones() {
        return new Promise((resolve, reject) => {
            try {
                const query = `
                    SELECT d.id, d.estado, d.id_usuario_FK,
                    u.nombre as nombre_usuario, u.correo as correo_usuario
                    FROM dispositivos d
                    LEFT JOIN usuario u ON d.id_usuario_FK = u.idUsuario
                `;
                
                conexion.execute(query, [], (error, resultados) => {
                    if (error) {
                        return reject(new Error('Error al acceder a la base de datos'));
                    }
                    
                    const vinculaciones = resultados.map(fila => ({
                        dispositivo: new DispositivoModelo(
                            fila.id, 
                            Boolean(fila.estado),
                            fila.id_usuario_FK
                        ),
                        usuario: fila.id_usuario_FK ? {
                            id: fila.id_usuario_FK,
                            nombre: fila.nombre_usuario,
                            correo: fila.correo_usuario
                        } : null
                    }));
                    
                    resolve(vinculaciones);
                });
            } catch {
                reject(new Error('Error al acceder a la base de datos'));
            }
        });
    }
}

module.exports = DispositivoRepositorio;
