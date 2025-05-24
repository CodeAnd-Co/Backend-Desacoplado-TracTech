const conexion = require('../../../util/servicios/bd.js');

class EliminarPlantilla {
  /**
   * Elimina una plantilla y todos sus elementos relacionados
   * @param {number} idPlantilla - ID de la plantilla a eliminar
   * @returns {Promise<Object>} - Resultado de la operación
   */
  static async eliminarPlantilla(idPlantilla) {
    return new Promise((resolve, reject) => {
      conexion.getConnection((err, conn) => {
        if (err) return reject(err);
        conn.beginTransaction(err => {
          if (err) {
            conn.release();
            return reject(err);
          }
          conn.query(
            `DELETE g
               FROM grafica g
               JOIN contenido c ON g.IdContenido = c.IdContenido
              WHERE c.IdPlantilla = ?`,
            [idPlantilla],
            (err) => {
              if (err) return conn.rollback(() => {
                conn.release();
                reject(err);
              });
              conn.query(
                `DELETE t
                   FROM texto t
                   JOIN contenido c ON t.IdContenido = c.IdContenido
                  WHERE c.IdPlantilla = ?`,
                [idPlantilla],
                (err) => {
                  if (err) return conn.rollback(() => {
                    conn.release();
                    reject(err);
                  });
                  conn.query(
                    `DELETE FROM contenido
                      WHERE IdPlantilla = ?`,
                    [idPlantilla],
                    (err) => {
                      if (err) return conn.rollback(() => {
                        conn.release();
                        reject(err);
                      });
                      conn.query(
                        `DELETE FROM plantillareporte
                          WHERE idPlantillaReporte = ?`,
                        [idPlantilla],
                        (err) => {
                          if (err) return conn.rollback(() => {
                            conn.release();
                            reject(err);
                          });                        
                          conn.query(
                            `DELETE FROM plantilla
                              WHERE idPlantilla = ?`,
                            [idPlantilla],
                            (err, result) => {
                              if (err) return conn.rollback(() => {
                                conn.release();
                                reject(err);
                              });
                              conn.commit(commitErr => {
                                if (commitErr) {
                                  return conn.rollback(() => {
                                    conn.release();
                                    reject(commitErr);
                                  });
                                }
                                conn.release();
                                resolve(result);
                              });
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        });
      });
    });
  }
}

module.exports = EliminarPlantilla;