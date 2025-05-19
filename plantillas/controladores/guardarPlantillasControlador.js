const { insertarPlantilla }        = require('../data/repositorios/repositorioPlantillas');
const { insertarPlantillaReporte } = require('../data/repositorios/repositorioPlantillaReporte');
const { insertarContenido }        = require('../data/repositorios/repositorioContenido');
const { insertarGrafica }          = require('../data/repositorios/repositorioGrafica');
const { insertarTexto }            = require('../data/repositorios/repositorioTexto');

/**
 * Map JS Chart.js types to the ENUM values in the 'grafica' table.
 * ENUM('Linea','Barras','Pastel','Dona','Radar','Polar')
 *
 * @param {string} jsType - e.g. 'line','bar','pie','doughnut','radar','polarArea'
 * @returns {string}      - One of 'Linea','Barras','Pastel','Dona','Radar','Polar'
 * @throws {Error}       - If an unknown chart type is provided
 */
function mapChartTypeToEnum(jsType) {
  switch (jsType) {
    case 'line':      return 'Linea';
    case 'bar':       return 'Barras';
    case 'pie':       return 'Pastel';
    case 'doughnut':  return 'Dona';
    case 'radar':     return 'Radar';
    case 'polarArea': return 'Polar';
    default:
      throw new Error(`Tipo de gráfica inválido: "${jsType}"`);
  }
}

exports.guardarPlantilla = async (req, res) => {
  const { plantilla } = req.body;

  if (!plantilla ||!plantilla.nombrePlantilla ) {
    return res
      .status(400)
      .json({ mensaje: 'Faltan campos: nombrePlantilla o contenidos'});
  }

  try {
    const idPlantilla = await insertarPlantilla({
      NombrePlantilla: plantilla.nombrePlantilla,
      FrecuenciaEnvio: plantilla.frecuenciaEnvio,
      CorreoDestino:   plantilla.correoDestino,
      NumeroDestino:   plantilla.numeroDestino
    });

    // Optionally also insert into 'plantillareporte'
    const idPlantillaReporte = await insertarPlantillaReporte({
      Nombre:          plantilla.nombrePlantilla,
      Datos:           plantilla.html || '',
      FrecuenciaEnvio: plantilla.frecuenciaEnvio,
      CorreoDestino:   plantilla.correoDestino,
      NumeroDestino:   plantilla.numeroDestino
    });

    // Insert each content item into 'contenido' and its detail table
    for (const contenido of plantilla.datos) {
      const idContenido = await insertarContenido({
        OrdenContenido: contenido.ordenContenido,
        TipoContenido:  contenido.tipoContenido,
        IdPlantilla:    idPlantilla
      });

      if (contenido.tipoContenido === 'Grafica') {
        const enumTipo = mapChartTypeToEnum(contenido.tipoGrafica);
        await insertarGrafica({
          NombreGrafica: contenido.nombreGrafica,
          TipoGrafica:   enumTipo,
          Parametros:    contenido.parametros,
          IdContenido:   idContenido
        });

      } else if (contenido.tipoContenido === 'Texto') {
        await insertarTexto({
          TipoTexto:      contenido.tipoTexto,
          Alineacion:     contenido.alineacion,
          ContenidoTexto: contenido.contenidoTexto,
          IdContenido:    idContenido
        });
      }
    }

    return res
      .status(201)
      .json({ mensaje: 'Plantilla y contenidos guardados', id: idPlantillaReporte });

  } catch (error) {
    console.error('Error interno al guardar plantilla:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};