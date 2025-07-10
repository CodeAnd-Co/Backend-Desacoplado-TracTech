//RF35 Usuario selecciona y aplica plantilla de reporte mejorada

const { obtenerPlantillaCompletaRepositorio } = require('../data/repositorios/repositorioPlantillaCompleta.js');
const { obtenerFormulasPorGraficaRepositorio } = require('../data/repositorios/repositorioFormulasPlantilla.js');

/**
 * Valida la compatibilidad de datos entre la plantilla y los datos actuales
 * @param {Object} datosOriginalesPlantilla - Estructura de datos de la plantilla
 * @param {string} datosActualesString - Datos actuales como string JSON
 * @returns {Object} - Resultado de validación de compatibilidad
 */
function validarCompatibilidadDatos(datosOriginalesPlantilla, datosActualesString) {
  try {
    const datosActuales = JSON.parse(datosActualesString || '{}');
    
    const compatibilidad = {
      esCompatible: true,
      advertencias: [],
      diferencias: [],
      hojasComunes: [],
      hojasFaltantes: []
    };

    // Extraer hojas utilizadas en la plantilla
    const hojasPlantilla = new Set();
    if (datosOriginalesPlantilla.datos) {
      datosOriginalesPlantilla.datos.forEach(elemento => {
        if (elemento.datos?.columna?.hoja) {
          hojasPlantilla.add(elemento.datos.columna.hoja);
        }
      });
    }

    // Comparar con datos actuales
    const hojasActuales = Object.keys(datosActuales);
    const hojasPlantillaArray = Array.from(hojasPlantilla);

    hojasPlantillaArray.forEach(hoja => {
      if (hojasActuales.includes(hoja)) {
        compatibilidad.hojasComunes.push(hoja);
      } else {
        compatibilidad.hojasFaltantes.push(hoja);
        compatibilidad.advertencias.push(`La hoja "${hoja}" no está disponible en los datos actuales`);
      }
    });

    // Determinar compatibilidad general
    if (compatibilidad.hojasFaltantes.length > 0) {
      compatibilidad.esCompatible = false;
      compatibilidad.diferencias.push('Faltan hojas de datos requeridas por la plantilla');
    }

    return compatibilidad;
  } catch (error) {
    return {
      esCompatible: false,
      advertencias: ['Error al procesar los datos para validación de compatibilidad'],
      diferencias: ['No se pudieron validar los datos'],
      hojasComunes: [],
      hojasFaltantes: []
    };
  }
}

/**
 * Aplica configuración avanzada específica a elementos de gráfica
 * @param {Object} elementoGrafica - Elemento de gráfica de la plantilla
 * @returns {Object} - Configuración procesada lista para aplicar
 */
function procesarConfiguracionAvanzada(elementoGrafica) {
  const configuracionProcesada = {
    // Configuración básica
    tipo: 'grafica',
    id: elementoGrafica.id || `grafica-${Date.now()}`,
    titulo: elementoGrafica.nombreGrafica || 'Gráfica sin título',
    tipoGrafica: elementoGrafica.tipoGrafica || 'bar',
    color: elementoGrafica.color || '#A61930',
    
    // Configuración de datos
    tractorSeleccionado: elementoGrafica.tractorSeleccionado,
    datos: elementoGrafica.datos || {},
    
    // Configuración avanzada
    configuracionAvanzada: {
      ...elementoGrafica.configuracionAvanzada,
      fechaAplicacion: new Date().toISOString(),
      origenPlantilla: true
    }
  };

  // Procesar parámetros de fórmula si existen
  if (elementoGrafica.datos?.parametrosFormula) {
    configuracionProcesada.parametrosFormula = elementoGrafica.datos.parametrosFormula.map(param => ({
      ...param,
      procesado: true,
      fechaAplicacion: new Date().toISOString()
    }));
  }

  return configuracionProcesada;
}

/**
 * Genera estadísticas de aplicación de la plantilla
 * @param {Object} plantillaCompleta - Datos completos de la plantilla
 * @returns {Object} - Estadísticas detalladas
 */
function generarEstadisticasAplicacion(plantillaCompleta) {
  const estadisticas = {
    elementosTotal: 0,
    elementosAplicados: 0,
    graficasConDatos: 0,
    formulasIncluidas: [],
    textosIncluidos: 0,
    tractoresReferenciados: new Set(),
    hojasUtilizadas: new Set()
  };

  if (plantillaCompleta.datos) {
    estadisticas.elementosTotal = plantillaCompleta.datos.length;
    estadisticas.elementosAplicados = plantillaCompleta.datos.length;

    plantillaCompleta.datos.forEach(elemento => {
      if (elemento.tipoContenido === 'Grafica') {
        if (elemento.datos?.columna?.nombre || elemento.datos?.formula?.nombre) {
          estadisticas.graficasConDatos++;
        }

        if (elemento.datos?.formula?.nombre) {
          estadisticas.formulasIncluidas.push(elemento.datos.formula.nombre);
        }

        if (elemento.tractorSeleccionado) {
          estadisticas.tractoresReferenciados.add(elemento.tractorSeleccionado);
        }

        if (elemento.datos?.columna?.hoja) {
          estadisticas.hojasUtilizadas.add(elemento.datos.columna.hoja);
        }
      } else if (elemento.tipoContenido === 'Texto') {
        estadisticas.textosIncluidos++;
      }
    });
  }

  return {
    ...estadisticas,
    tractoresReferenciados: Array.from(estadisticas.tractoresReferenciados),
    hojasUtilizadas: Array.from(estadisticas.hojasUtilizadas),
    formulasIncluidas: [...new Set(estadisticas.formulasIncluidas)]
  };
}

/**
 * Controlador mejorado para cargar y aplicar plantillas
 */
exports.cargarYAplicarPlantilla = async (req, res) => {
  const { idPlantilla, datosActuales = null, validarCompatibilidad = true } = req.body;

  if (!idPlantilla) {
    return res.status(400).json({
      mensaje: 'Falta el ID de la plantilla',
      exito: false
    });
  }

  try {
    // 1. Obtener plantilla completa
    const plantillaCompleta = await obtenerPlantillaCompletaRepositorio(idPlantilla);
    
    if (!plantillaCompleta) {
      return res.status(404).json({
        mensaje: 'Plantilla no encontrada',
        exito: false
      });
    }

    // 2. Validar compatibilidad si se proporcionaron datos actuales
    let compatibilidad = null;
    if (validarCompatibilidad && datosActuales) {
      compatibilidad = validarCompatibilidadDatos(plantillaCompleta, datosActuales);
    }

    // 3. Procesar configuración avanzada para cada elemento
    const elementosProcesados = [];
    const formulasEncontradas = [];

    if (plantillaCompleta.datos) {
      for (const elemento of plantillaCompleta.datos) {
        if (elemento.tipoContenido === 'Grafica') {
          const configuracionProcesada = procesarConfiguracionAvanzada(elemento);
          elementosProcesados.push(configuracionProcesada);

          // Obtener fórmulas asociadas si las hay
          if (elemento.id) {
            try {
              const formulas = await obtenerFormulasPorGraficaRepositorio(elemento.id);
              if (formulas.length > 0) {
                formulasEncontradas.push(...formulas);
              }
            } catch (formulaError) {
              console.warn('No se pudieron obtener fórmulas para gráfica:', elemento.id);
            }
          }
        } else {
          elementosProcesados.push(elemento);
        }
      }
    }

    // 4. Generar estadísticas de aplicación
    const estadisticas = generarEstadisticasAplicacion(plantillaCompleta);

    // 5. Estructura de respuesta mejorada
    const respuesta = {
      mensaje: 'Plantilla cargada exitosamente',
      exito: true,
      plantilla: {
        ...plantillaCompleta.plantilla,
        metadatos: {
          fechaCarga: new Date().toISOString(),
          compatibilidadValidada: !!compatibilidad,
          formulasEncontradas: formulasEncontradas.length
        }
      },
      elementos: elementosProcesados,
      estadisticas: estadisticas,
      compatibilidad: compatibilidad,
      formulasAsociadas: formulasEncontradas.length > 0 ? formulasEncontradas : null
    };

    // 6. Agregar advertencias si hay problemas de compatibilidad
    if (compatibilidad && !compatibilidad.esCompatible) {
      respuesta.advertencias = compatibilidad.advertencias;
      respuesta.mensaje = 'Plantilla cargada con advertencias de compatibilidad';
    }

    return res.status(200).json(respuesta);

  } catch (error) {
    console.error('Error al cargar y aplicar plantilla:', error);
    return res.status(500).json({
      mensaje: 'Error interno del servidor al cargar la plantilla',
      error: 'INTERNAL_SERVER_ERROR',
      exito: false
    });
  }
};

/**
 * Controlador para seleccionar plantilla (compatibilidad hacia atrás)
 */
exports.seleccionarPlantilla = async (req, res) => {
  const { idPlantilla } = req.body;

  if (!idPlantilla) {
    return res.status(400).json({
      mensaje: 'Faltan datos requeridos',
    });
  }

  try {
    const plantillaCompleta = await obtenerPlantillaCompletaRepositorio(idPlantilla);
    
    if (!plantillaCompleta) {
      return res.status(404).json({
        mensaje: 'Plantilla no encontrada',
      });
    }

    res.status(200).json({
      mensaje: 'Consulta de plantilla exitosa',
      plantilla: plantillaCompleta,
    });
  } catch (error) {
    console.error('Error al seleccionar plantilla:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
