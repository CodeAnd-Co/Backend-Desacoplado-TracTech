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
                    SELECT id, estado
                    FROM dispositivos 
                    WHERE id = ?
                `;
                
                conexion.execute(query, [id], (error, resultados) => {
                    if (error) {
                        console.error('Error al obtener dispositivo:', error);
                        return reject(new Error('Error al acceder a la base de datos'));
                    }
                    
                    if (resultados.length === 0) {
                        return resolve(null);
                    }
                      const fila = resultados[0];
                    // Convertir explícitamente el estado de MySQL (0/1) a boolean
                    const dispositivo = new DispositivoModelo(fila.id, Boolean(fila.estado));
                    
                    resolve(dispositivo);
                });
            } catch (error) {
                console.error('Error al obtener dispositivo:', error);
                reject(new Error('Error al acceder a la base de datos'));
            }
        });
    }    /**
     * Registra un nuevo dispositivo o actualiza uno existente en la base de datos
     * @param {string} id - ID del dispositivo
     * @returns {DispositivoModelo}
     */
    static async registrarOActualizar(id) {
        return new Promise((resolve, reject) => {
            try {
                // Usar INSERT ... ON DUPLICATE KEY UPDATE para manejar registro o actualización
                const query = `
                    INSERT INTO dispositivos (id, estado) 
                    VALUES (?, TRUE)
                    ON DUPLICATE KEY UPDATE estado = estado
                `;
                
                conexion.execute(query, [id], (error) => {
                    if (error) {
                        console.error('Error al registrar/actualizar dispositivo:', error);
                        return reject(new Error('Error al acceder a la base de datos'));
                    }
                    
                    // Obtener el dispositivo actualizado desde la base de datos
                    this.obtenerPorId(id)
                        .then(dispositivo => {
                            if (dispositivo) {
                                resolve(dispositivo);
                            } else {
                                // Si por alguna razón no se encuentra, crear uno nuevo activo
                                resolve(new DispositivoModelo(id, true));
                            }
                        })
                        .catch(err => reject(err));
                });
            } catch (error) {
                console.error('Error al registrar/actualizar dispositivo:', error);
                reject(new Error('Error al acceder a la base de datos'));
            }
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
                        console.error('Error al habilitar dispositivo:', error);
                        return reject(new Error('Error al acceder a la base de datos'));
                    }
                    
                    if (resultado.affectedRows === 0) {
                        return reject(new Error('Dispositivo no encontrado'));
                    }
                    
                    const dispositivo = new DispositivoModelo(id, true);
                    resolve(dispositivo);
                });
            } catch (error) {
                console.error('Error al habilitar dispositivo:', error);
                reject(new Error('Error al acceder a la base de datos'));
            }
        });
    }

    /**
     * Deshabilita un dispositivo en la base de datos
     * @param {string} id - ID del dispositivo
     * @returns {DispositivoModelo}
     */
    static async deshabilitar(id) {
        return new Promise((resolve, reject) => {
            try {
                const query = `
                    UPDATE dispositivos 
                    SET estado = FALSE
                    WHERE id = ?
                `;
                
                conexion.execute(query, [id], (error, resultado) => {
                    if (error) {
                        console.error('Error al deshabilitar dispositivo:', error);
                        return reject(new Error('Error al acceder a la base de datos'));
                    }
                    
                    if (resultado.affectedRows === 0) {
                        return reject(new Error('Dispositivo no encontrado'));
                    }
                    
                    const dispositivo = new DispositivoModelo(id, false);
                    resolve(dispositivo);
                });
            } catch (error) {
                console.error('Error al deshabilitar dispositivo:', error);
                reject(new Error('Error al acceder a la base de datos'));
            }
        });
    }

    /**
     * Obtiene todos los dispositivos de la base de datos
     * @returns {DispositivoModelo[]}
     */
    static async obtenerTodos() {
        return new Promise((resolve, reject) => {
            try {
                const query = `
                    SELECT id, estado
                    FROM dispositivos 
                    ORDER BY id
                `;
                
                conexion.execute(query, [], (error, resultados) => {
                    if (error) {                        console.error('Error al obtener dispositivos:', error);
                        return reject(new Error('Error al acceder a la base de datos'));
                    }
                    
                    const dispositivos = resultados.map(fila => 
                        new DispositivoModelo(fila.id, Boolean(fila.estado)));
                    
                    resolve(dispositivos);
                });
            } catch (error) {
                console.error('Error al obtener dispositivos:', error);
                reject(new Error('Error al acceder a la base de datos'));
            }
        });
    }

    /**
     * Obtiene dispositivos filtrados por estado
     * @param {boolean} estado - true para activos, false para inactivos
     * @returns {DispositivoModelo[]}
     */
    static async obtenerPorEstado(estado) {
        return new Promise((resolve, reject) => {
            try {
                const query = `
                    SELECT id, estado
                    FROM dispositivos 
                    WHERE estado = ?
                    ORDER BY id
                `;
                
                conexion.execute(query, [estado], (error, resultados) => {
                    if (error) {                        console.error('Error al obtener dispositivos por estado:', error);
                        return reject(new Error('Error al acceder a la base de datos'));
                    }
                    
                    const dispositivos = resultados.map(fila => 
                        new DispositivoModelo(fila.id, Boolean(fila.estado)));
                    
                    resolve(dispositivos);
                });
            } catch (error) {
                console.error('Error al obtener dispositivos por estado:', error);
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
                        console.error('Error al eliminar dispositivo:', error);
                        return reject(new Error('Error al acceder a la base de datos'));
                    }
                    
                    resolve(resultado.affectedRows > 0);
                });
            } catch (error) {
                console.error('Error al eliminar dispositivo:', error);
                reject(new Error('Error al acceder a la base de datos'));
            }
        });
    }
}

module.exports = DispositivoRepositorio;
