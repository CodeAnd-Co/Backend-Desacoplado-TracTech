const conexion = require('../../util/bd.js');

/**
 * Consulta una plantilla completa con todos sus componentes asociados
 * 
 * @param {number} idPlantilla - ID de la plantilla a consultar
 * @returns {Promise<Object>} - Datos completos de la plantilla con sus componentes
 */
async function obtenerPlantillaCompleta(idPlantilla) {
  return new Promise((resolve, reject) => {
    conexion.getConnection((err, conn) => {
      if (err) return reject(err);
      
      // 1. Obtener datos básicos de la plantilla
      conn.query(
        `SELECT p.*, pr.* 
         FROM plantilla p
         JOIN plantillareporte pr ON p.idPlantilla = pr.IdPlantilla
         WHERE pr.idPlantillaReporte = ?`,
        [idPlantilla],
        (err, plantillaResult) => {
          if (err) {
            conn.release();
            return reject(err);
          }
          
          if (plantillaResult.length === 0) {
            conn.release();
            return resolve(null); // Plantilla no encontrada
          }
          
          const plantillaData = plantillaResult[0];
          
          // 2. Obtener contenidos de la plantilla ordenados
          conn.query(
            `SELECT * 
             FROM contenido 
             WHERE IdPlantilla = ? 
             ORDER BY OrdenContenido ASC`,
            [idPlantilla],
            (err, contenidoResult) => {
              if (err) {
                conn.release();
                return reject(err);
              }
              
              const contenidos = contenidoResult;
              const contenidoIds = contenidos.map(constante => constante.IdContenido);
              
              if (contenidoIds.length === 0) {
                // No hay contenidos, devolver solo la plantilla
                conn.release();
                return resolve({
                  plantilla: plantillaData,
                  contenidos: []
                });
              }
              
              // 3. Obtener datos de gráficas
              conn.query(
                `SELECT g.*, c.OrdenContenido, c.TipoContenido 
                 FROM grafica g
                 JOIN contenido c ON g.IdContenido = c.IdContenido
                 WHERE c.IdPlantilla = ?
                 ORDER BY c.OrdenContenido ASC`,
                [idPlantilla],
                (err, graficasResult) => {
                  if (err) {
                    conn.release();
                    return reject(err);
                  }
                  
                  // 4. Obtener datos de textos
                  conn.query(
                    `SELECT t.*, c.OrdenContenido, c.TipoContenido 
                     FROM texto t
                     JOIN contenido c ON t.IdContenido = c.IdContenido
                     WHERE c.IdPlantilla = ?
                     ORDER BY c.OrdenContenido ASC`,
                    [idPlantilla],
                    (err, textosResult) => {
                      conn.release();
                      
                      if (err) {
                        return reject(err);
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
                          tipoContenido: tipoContenido
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
                            } catch (error) {
                              console.warn('Error al parsear JSON de parámetros de gráfica:', error);
                              itemContenido.parametros = {};
                            }
                          }
                        } else if (tipoContenido === 'Texto') {
                          const texto = textosResult.find(texto => texto.IdContenido === idContenido);
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

/**
 * Controlador para consultar plantilla completa
 */
exports.consultarPlantillaCompleta = async (req, res) => {
  const { idPlantilla } = req.body;
  
  if (!idPlantilla) {
    return res.status(400).json({ mensaje: 'Falta idPlantilla' });
  }
  
  try {
    const resultado = await obtenerPlantillaCompleta(idPlantilla);
    
    if (!resultado) {
      return res.status(404).json({ mensaje: 'Plantilla no encontrada' });
    }
    
    res.status(200).json({ 
      mensaje: 'Consulta exitosa', 
      plantillaCompleta: resultado 
    });
    
  } catch (error) {
    console.error('Error al consultar plantilla completa:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};