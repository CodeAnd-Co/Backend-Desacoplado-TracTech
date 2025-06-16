const conexion = require('../../../util/servicios/bd.js');

class PlantillaCompleta {
  /**
   * Consulta una plantilla completa con todos sus componentes asociados
   * 
   * @param {number} idPlantilla - ID de la plantilla a consultar
   * @returns {Promise<Object>} - Datos completos de la plantilla con sus componentes
   */
  static async obtenerPlantillaCompleta(idPlantilla) {
    return new Promise((resolve, reject) => {
      conexion.getConnection((error, conexionDb) => {
        if (error) return reject(error);
        
        // 1. Obtener datos básicos de la plantilla
        conexionDb.query(
          `SELECT p.*, pr.* 
           FROM plantilla p
           JOIN plantillareporte pr ON p.idPlantilla = pr.IdPlantilla
           WHERE pr.idPlantillaReporte = ?`,
          [idPlantilla],
          (error, plantillaResultado) => {
            if (error) {
              conexionDb.release();
              return reject(error);
            }
            
            if (plantillaResultado.length === 0) {
              conexionDb.release();
              return resolve(null); // Plantilla no encontrada
            }
            
            const plantillaData = plantillaResultado[0];
            
            // 2. Obtener contenidos de la plantilla ordenados
            conexionDb.query(
              `SELECT * 
               FROM contenido 
               WHERE IdPlantilla = ? 
               ORDER BY OrdenContenido ASC`,
              [idPlantilla],
              (error, contenidoResultado) => {
                if (error) {
                  conexionDb.release();
                  return reject(error);
                }
                
                const contenidos = contenidoResultado;
                const contenidoIds = contenidos.map(constante => constante.IdContenido);
                
                if (contenidoIds.length === 0) {
                  // No hay contenidos, devolver solo la plantilla
                  conexionDb.release();
                  return resolve({
                    plantilla: plantillaData,
                    contenidos: []
                  });
                }
                
                // 3. Obtener datos de gráficas
                conexionDb.query(
                  `SELECT g.*, c.OrdenContenido, c.TipoContenido 
                   FROM grafica g
                   JOIN contenido c ON g.IdContenido = c.IdContenido
                   WHERE c.IdPlantilla = ?
                   ORDER BY c.OrdenContenido ASC`,
                  [idPlantilla],
                  (error, graficasResult) => {
                    if (error) {
                      conexionDb.release();
                      return reject(error);
                    }
                    
                    // 4. Obtener datos de textos
                    conexionDb.query(
                      `SELECT t.*, c.OrdenContenido, c.TipoContenido 
                       FROM texto t
                       JOIN contenido c ON t.IdContenido = c.IdContenido
                       WHERE c.IdPlantilla = ?
                       ORDER BY c.OrdenContenido ASC`,
                      [idPlantilla],
                      (error, textosResultado) => {
                        conexionDb.release();
                        
                        if (error) {
                          return reject(error);
                        }
                        
                        // 5. Construir resultado
                        const datosContenido = [];
                        
                        // Procesar cada contenido según su tipo
                        for (const contenido of contenidos) {
                          const idContenido = contenido.IdContenido;
                          const tipoContenido = contenido.TipoContenido;
                          
                          // Crear objeto base para cada contenido
                          const itemContenido = {
                            id: idContenido,
                            ordenContenido: contenido.OrdenContenido,
                            tipoContenido
                          };
                          
                          // Agregar datos específicos según el tipo
                          if (tipoContenido === 'Grafica') {
                            const grafica = graficasResult.find(grafica => grafica.IdContenido === idContenido);
                            if (grafica) {
                              // Mapear el tipo de gráfica de la BD al formato JS
                              const tipoGraficaMap = {
                                'Linea': 'line',
                                'Barras': 'bar',
                                'Pastel': 'pie',
                                'Dona': 'doughnut',
                                'Radar': 'radar',
                                'Polar': 'polarArea'
                              };
                              
                              itemContenido.nombreGrafica = grafica.NombreGrafica;
                              itemContenido.tipoGrafica = tipoGraficaMap[grafica.TipoGrafica] || grafica.TipoGrafica;
                              
                              // Parsear los parámetros JSON
                              try {
                                itemContenido.parametros = JSON.parse(grafica.Parametros);
                              } catch {
                                itemContenido.parametros = {};
                              }
                            }
                          } else if (tipoContenido === 'Texto') {
                            const texto = textosResultado.find(texto => texto.IdContenido === idContenido);
                            if (texto) {
                              itemContenido.tipoTexto = texto.TipoTexto;
                              itemContenido.alineacion = texto.Alineacion;
                              itemContenido.contenidoTexto = texto.ContenidoTexto;
                            }
                          }
                          
                          datosContenido.push(itemContenido);
                        }
                        
                        // 6. Estructura final de la respuesta
                        const resultado = {
                          plantilla: {
                            id: plantillaData.idPlantillaReporte,
                            nombrePlantilla: plantillaData.Nombre || plantillaData.NombrePlantilla,
                            frecuenciaEnvio: plantillaData.FrecuenciaEnvio,
                            correoDestino: plantillaData.CorreoDestino,
                            numeroDestino: plantillaData.NumeroDestino,
                            htmlString: plantillaData.Datos
                          },
                          datos: datosContenido
                        };
                        
                        resolve(resultado);
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
  }
}

module.exports = PlantillaCompleta;