//RF34 Usuario guarda plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF34

const { insertarPlantillaReporte }        = require('../data/repositorios/plantillasRepositorio.js');
const { insertarPlantilla }        = require('../data/repositorios/repositorioPlantillas.js');
const { insertarContenidoRepositorio }        = require('../data/repositorios/repositorioContenido.js');
const { insertarGraficaRepositorio }          = require('../data/repositorios/repositorioGrafica.js');
const { insertarTextoRepositorio }            = require('../data/repositorios/repositorioTexto.js');
const { insertarFormulaRepositorio }          = require('../data/repositorios/repositorioFormulasPlantilla.js');
const Grafica = require('../data/modelos/modeloGráfica.js');

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
      throw new Error(`Tipo de gráfica inválido: '${jsType}'`);
  }
}

/**
 * Valida y estructura la configuración completa de una plantilla
 * @param {Object} plantilla - Datos de la plantilla desde el frontend
 * @returns {Object} - Resultado de validación con estadísticas
 */
function validarConfiguracionPlantilla(plantilla) {
  const estadisticas = {
    totalElementos: 0,
    graficasConDatos: 0,
    formulasAplicadas: 0,
    textosVacios: 0,
    tiposFormulaUnicos: new Set(),
    elementosConTractores: 0
  };

  if (!plantilla.datos || !Array.isArray(plantilla.datos)) {
    return {
      valida: false,
      mensaje: 'No se encontraron datos válidos en la plantilla',
      estadisticas
    };
  }

  estadisticas.totalElementos = plantilla.datos.length;

  // Validar cada elemento
  plantilla.datos.forEach(elemento => {
    if (elemento.tipoContenido === 'Grafica') {
      // Validar si la gráfica tiene datos aplicados
      if (elemento.datos && (
        (elemento.datos.tipoOrigen === 'columna' && elemento.datos.columna?.nombre) ||
        (elemento.datos.tipoOrigen === 'formula' && elemento.datos.formula?.nombre)
      )) {
        estadisticas.graficasConDatos++;
      }

      // Contar fórmulas aplicadas
      if (elemento.datos?.formula?.nombre) {
        estadisticas.formulasAplicadas++;
        estadisticas.tiposFormulaUnicos.add(elemento.datos.formula.nombre);
      }

      // Contar elementos con tractores específicos
      if (elemento.tractorSeleccionado) {
        estadisticas.elementosConTractores++;
      }
    } else if (elemento.tipoContenido === 'Texto') {
      // Detectar textos vacíos
      if (!elemento.contenidoTexto || elemento.contenidoTexto.trim() === '') {
        estadisticas.textosVacios++;
      }
    }
  });

  return {
    valida: true,
    estadisticas: {
      ...estadisticas,
      tiposFormulaUnicos: Array.from(estadisticas.tiposFormulaUnicos)
    }
  };
}

/**
 * Extrae información detallada de las fórmulas utilizadas en la plantilla
 * @param {Object} plantilla - Datos de la plantilla
 * @returns {Object} - Información de fórmulas estructurada
 */
function capturarInformacionFormulas(plantilla) {
  const formulasEnUso = [];
  const parametrosGlobales = {};
  
  if (!plantilla.datos) return { formulasEnUso, parametrosGlobales };

  plantilla.datos.forEach((elemento, index) => {
    if (elemento.tipoContenido === 'Grafica' && elemento.datos?.formula) {
      const formula = elemento.datos.formula;
      
      formulasEnUso.push({
        graficaId: elemento.id || `grafica-${index}`,
        nombreFormula: formula.nombre,
        estructuraFormula: formula.estructuraFormula,
        parametros: elemento.datos.parametrosFormula || [],
        resultados: formula.resultados || []
      });
    }

    // Capturar información de hojas y columnas disponibles
    if (elemento.datos?.columna?.hoja && elemento.datos?.columna?.nombre) {
      const hoja = elemento.datos.columna.hoja;
      if (!parametrosGlobales[hoja]) {
        parametrosGlobales[hoja] = new Set();
      }
      parametrosGlobales[hoja].add(elemento.datos.columna.nombre);
    }
  });

  // Convertir Sets a arrays
  Object.keys(parametrosGlobales).forEach(hoja => {
    parametrosGlobales[hoja] = Array.from(parametrosGlobales[hoja]);
  });

  return {
    formulasEnUso,
    parametrosGlobales,
    estadisticas: {
      totalFormulasAplicadas: formulasEnUso.length,
      tiposFormulaUnicos: [...new Set(formulasEnUso.map(f => f.nombreFormula))],
      parametrosTotal: Object.values(parametrosGlobales).reduce((acc, cols) => acc + cols.length, 0)
    }
  };
}

/**
 * Procesa y guarda las fórmulas asociadas a una gráfica
 * @param {number} idGrafica - ID de la gráfica guardada
 * @param {Object} datosGrafica - Datos completos de la gráfica
 * @returns {Promise<number>} - Número de fórmulas guardadas
 */
async function procesarFormulasGrafica(idGrafica, datosGrafica) {
  let formulasGuardadas = 0;

  if (datosGrafica.datos?.formula && datosGrafica.datos.formula.nombre) {
    await insertarFormulaRepositorio({
      IdGrafica: idGrafica,
      NombreFormula: datosGrafica.datos.formula.nombre,
      EstructuraFormula: datosGrafica.datos.formula.estructuraFormula || '',
      Parametros: datosGrafica.datos.parametrosFormula || [],
      ResultadosEjemplo: datosGrafica.datos.formula.resultados || [],
      EstadoFormula: 'activa'
    });
    formulasGuardadas++;
  }

  return formulasGuardadas;
}

exports.guardarPlantilla = async (req, res) => {
  const { plantilla } = req.body;

  // Validación básica
  if (!plantilla || !plantilla.nombrePlantilla) {
    return res.status(400).json({ mensaje: 'Faltan campos: nombrePlantilla o datos' });
  }

  try {
    // Paso 1: Validar configuración completa de la plantilla
    const validacion = validarConfiguracionPlantilla(plantilla);
    if (!validacion.valida) {
      return res.status(400).json({ 
        mensaje: validacion.mensaje,
        error: 'VALIDACION_FALLIDA'
      });
    }

    // Paso 2: Capturar información de fórmulas
    const informacionFormulas = capturarInformacionFormulas(plantilla);
    
    // Paso 3: Insertar plantilla principal
    const idPlantilla = await insertarPlantilla({
      NombrePlantilla: plantilla.nombrePlantilla,
      FrecuenciaEnvio: plantilla.frecuenciaEnvio || 0,
      CorreoDestino: plantilla.correoDestino || '',
      NumeroDestino: plantilla.numeroDestino || ''
    });

    const idPlantillaReporte = await insertarPlantillaReporte({
      IdPlantilla: idPlantilla,
      Nombre: plantilla.nombrePlantilla,
      Datos: plantilla.htmlString || '',
      FrecuenciaEnvio: plantilla.frecuenciaEnvio || 0,
      CorreoDestino: plantilla.correoDestino || '',
      NumeroDestino: plantilla.numeroDestino || ''
    });

    // Contadores para estadísticas finales
    let formulasGuardadas = 0;
    let graficasGuardadas = 0;
    let textosGuardados = 0;

    // Paso 4: Procesar cada contenido con información extendida
    for (const contenido of plantilla.datos) {
      
      const idContenido = await insertarContenidoRepositorio({
        OrdenContenido: contenido.ordenContenido,
        TipoContenido:  contenido.tipoContenido,
        IdPlantilla:    idPlantilla
      });

      if (contenido.tipoContenido === 'Grafica') {
        // Validar y estructurar datos de gráfica mejorada
        const datosGraficaValidados = Grafica.validarDatosGrafica(contenido);
        const enumTipo = mapChartTypeToEnum(datosGraficaValidados.TipoGrafica);
        
        // Insertar gráfica con información completa
        const idGrafica = await insertarGraficaRepositorio({
          NombreGrafica: datosGraficaValidados.NombreGrafica,
          TipoGrafica: enumTipo,
          Parametros: datosGraficaValidados.Parametros,
          IdContenido: idContenido,
          // Nuevos campos
          Color: datosGraficaValidados.Color,
          TractorSeleccionado: datosGraficaValidados.TractorSeleccionado,
          TipoOrigen: datosGraficaValidados.TipoOrigen,
          ColumnaOrigen: datosGraficaValidados.ColumnaOrigen,
          FormulaAplicada: datosGraficaValidados.FormulaAplicada,
          Filtros: datosGraficaValidados.Filtros,
          ParametrosFormula: datosGraficaValidados.ParametrosFormula,
          ConfiguracionAvanzada: datosGraficaValidados.ConfiguracionAvanzada
        });

        // Procesar fórmulas asociadas
        const formulasDeEstaGrafica = await procesarFormulasGrafica(idGrafica, contenido);
        formulasGuardadas += formulasDeEstaGrafica;
        graficasGuardadas++;

      } else if (contenido.tipoContenido === 'Texto') {
        await insertarTextoRepositorio({
          TipoTexto: contenido.tipoTexto,
          Alineacion: contenido.alineacion,
          ContenidoTexto: contenido.contenidoTexto,
          IdContenido: idContenido
        });
        textosGuardados++;
      }
    }

    // Respuesta exitosa con estadísticas completas
    return res.status(201).json({ 
      mensaje: 'Plantilla guardada exitosamente',
      exito: true,
      id: idPlantillaReporte,
      estadisticas: {
        ...validacion.estadisticas,
        graficasGuardadas,
        textosGuardados,
        formulasGuardadas,
        formulasIncluidas: informacionFormulas.estadisticas.tiposFormulaUnicos
      },
      informacionFormulas: informacionFormulas.formulasEnUso.length > 0 ? {
        totalFormulas: informacionFormulas.formulasEnUso.length,
        tiposFormula: informacionFormulas.estadisticas.tiposFormulaUnicos,
        hojasUtilizadas: Object.keys(informacionFormulas.parametrosGlobales)
      } : null
    });

  } catch (error) {
    console.error('Error al guardar plantilla:', error);
    return res.status(500).json({ 
      mensaje: 'Error interno del servidor',
      error: 'INTERNAL_SERVER_ERROR',
      exito: false
    });
  }
};