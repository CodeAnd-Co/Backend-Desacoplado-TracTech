const { insertarPlantillaReporte }        = require('../data/repositorios/plantillasRepositorio.js');
const { insertarPlantilla }        = require('../data/repositorios/repositorioPlantillas.js');
const { insertarContenidoRepositorio }        = require('../data/repositorios/repositorioContenido.js');
const { insertarGraficaRepositorio }          = require('../data/repositorios/repositorioGrafica.js');
const { insertarTextoRepositorio }            = require('../data/repositorios/repositorioTexto.js');

/**
 * Convierte tipos de Chart.js al ENUM de la tabla 'grafica'.
 * ENUM('Linea','Barras','Pastel','Dona','Radar','Polar')
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

/**
 * Controlador HTTP para guardar una plantilla completa:
 * - Inserta en 'plantilla'
 * - Inserta en 'plantillareporte'
 * - Recorre y persiste cada contenido, gráfica o texto
 */
exports.guardarPlantilla = async (req, res) => {
  const { plantilla } = req.body;

  // Validación básica
  if (
    !plantilla || !plantilla.nombrePlantilla
  ) {
    return res.status(400).json({ mensaje: 'Faltan campos: nombrePlantilla o datos' });
  }

  try {
    console.log(req.body)
    const idPlantilla = await insertarPlantilla({
      NombrePlantilla: plantilla.nombrePlantilla,
      FrecuenciaEnvio: plantilla.frecuenciaEnvio || 0,
      CorreoDestino:   plantilla.correoDestino   || 0,
      NumeroDestino:   plantilla.numeroDestino   || 0
    });

    console.log("idplantila ",idPlantilla)
    const idPlantillaReporte = await insertarPlantillaReporte({
      IdPlantilla:     idPlantilla,
      Nombre:          plantilla.nombrePlantilla,
      Datos:           plantilla.htmlString || 0,
      FrecuenciaEnvio: plantilla.frecuenciaEnvio || 0,
      CorreoDestino:   plantilla.correoDestino   || 0,
      NumeroDestino:   plantilla.numeroDestino   || 0
    });

        console.log(idPlantillaReporte)
    for (const contenido of plantilla.datos) {
      const idContenido = await insertarContenidoRepositorio({
        OrdenContenido: contenido.ordenContenido,
        TipoContenido:  contenido.tipoContenido,
        IdPlantilla:    idPlantilla
        
      });
      console.log(idContenido)
      if (contenido.tipoContenido === 'Grafica') {
        const enumTipo = mapChartTypeToEnum(contenido.tipoGrafica);
        await insertarGraficaRepositorio({
          NombreGrafica: contenido.nombreGrafica,
          TipoGrafica:   enumTipo,
          Parametros:    contenido.parametros,
          IdContenido:   idContenido
        });
      } else if (contenido.tipoContenido === 'Texto') {
        await insertarTextoRepositorio({
          TipoTexto:      contenido.tipoTexto,
          Alineacion:     contenido.alineacion,
          ContenidoTexto: contenido.contenidoTexto,
          IdContenido:    idContenido
        });
      }
      
    }

    return res.status(201).json({ mensaje: 'OK', id: idPlantillaReporte });

  } catch (error) {
    console.error('Error interno al guardar plantilla:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
