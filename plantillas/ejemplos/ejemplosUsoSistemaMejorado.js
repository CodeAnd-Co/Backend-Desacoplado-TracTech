// Ejemplo práctico de uso del Sistema de Plantillas Mejorado
// Este archivo muestra cómo interactuar con el backend mejorado

const ejemplos = {
  
  // Ejemplo 1: Guardar una plantilla con configuración completa
  guardarPlantillaMejorada: {
    url: 'POST /plantillas/guardar',
    body: {
      plantilla: {
        nombrePlantilla: "Reporte Completo Tractores Q4 2024",
        descripcion: "Análisis trimestral con fórmulas avanzadas",
        frecuenciaEnvio: 168, // Semanal
        correoDestino: "gerencia@tractech.com",
        htmlString: "<div>Reporte generado...</div>",
        datos: [
          {
            ordenContenido: 1,
            tipoContenido: 'Grafica',
            // Campos básicos
            nombreGrafica: 'Rendimiento Promedio Mensual',
            tipoGrafica: 'bar',
            parametros: {
              showLegend: true,
              responsive: true
            },
            
            // Nuevos campos del sistema mejorado
            color: '#A61930',
            tractorSeleccionado: 'Tractor_001',
            datos: {
              tipoOrigen: 'formula',
              columna: {
                nombre: 'Rendimiento_Total',
                hoja: 'DatosRendimiento',
                indiceColumna: 2
              },
              formula: {
                nombre: 'Promedio_Rendimiento_Mensual',
                estructuraFormula: '=PROMEDIO(A:A)',
                resultados: [85.2, 87.1, 89.3, 86.7]
              },
              filtros: [
                { parametro: 'A', columna: 'Fecha', indice: 0 },
                { parametro: 'B', columna: 'TipoTractor', indice: 1 }
              ],
              parametrosFormula: [
                { 
                  letra: 'A', 
                  columnaAsignada: 'RendimientoDiario', 
                  posicion: 0, 
                  estaAsignado: true 
                }
              ]
            },
            configuracionAvanzada: {
              estadoGrafica: 'activa',
              tieneDatos: true,
              colorPersonalizado: '#A61930',
              tractorEspecifico: 'Tractor_001',
              chartConfig: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
                datasetLabel: 'Rendimiento (%)',
                tituloActual: 'Rendimiento Promedio por Mes'
              }
            }
          },
          {
            ordenContenido: 2,
            tipoContenido: 'Texto',
            tipoTexto: 'titulo',
            alineacion: 'center',
            contenidoTexto: 'Análisis de Rendimiento Q4 2024'
          },
          {
            ordenContenido: 3,
            tipoContenido: 'Grafica',
            nombreGrafica: 'Distribución por Región',
            tipoGrafica: 'pie',
            color: '#2E7D32',
            tractorSeleccionado: null, // Para todos los tractores
            datos: {
              tipoOrigen: 'columna',
              columna: {
                nombre: 'Region',
                hoja: 'DatosRegionales',
                indiceColumna: 0
              },
              filtros: [
                { parametro: 'A', columna: 'Estado', indice: 1 }
              ]
            },
            configuracionAvanzada: {
              estadoGrafica: 'activa',
              tieneDatos: true,
              chartConfig: {
                showPercentages: true,
                explodeSlice: 0
              }
            }
          }
        ]
      }
    },
    respuestaEsperada: {
      mensaje: "Plantilla guardada exitosamente",
      exito: true,
      id: 456,
      estadisticas: {
        totalElementos: 3,
        graficasConDatos: 2,
        formulasAplicadas: 1,
        textosVacios: 0,
        tiposFormulaUnicos: ["Promedio_Rendimiento_Mensual"],
        elementosConTractores: 1,
        graficasGuardadas: 2,
        textosGuardados: 1,
        formulasGuardadas: 1,
        formulasIncluidas: ["Promedio_Rendimiento_Mensual"]
      },
      informacionFormulas: {
        totalFormulas: 1,
        tiposFormula: ["Promedio_Rendimiento_Mensual"],
        hojasUtilizadas: ["DatosRendimiento"]
      }
    }
  },

  // Ejemplo 2: Cargar y aplicar plantilla con validación
  cargarPlantillaMejorada: {
    url: 'POST /plantillas/cargarMejorada/aplicar',
    body: {
      idPlantilla: 456,
      datosActuales: JSON.stringify({
        "DatosRendimiento": ["Fecha", "TipoTractor", "RendimientoDiario", "HorasTrabajo"],
        "DatosRegionales": ["Region", "Estado", "CantidadTractores"],
        "DatosNuevos": ["Mantenimiento", "Combustible"] // Hoja nueva no en plantilla
      }),
      validarCompatibilidad: true
    },
    respuestaEsperada: {
      mensaje: "Plantilla cargada exitosamente",
      exito: true,
      plantilla: {
        id: 456,
        nombrePlantilla: "Reporte Completo Tractores Q4 2024",
        frecuenciaEnvio: 168,
        correoDestino: "gerencia@tractech.com",
        metadatos: {
          fechaCarga: "2024-12-27T10:30:00.000Z",
          compatibilidadValidada: true,
          formulasEncontradas: 1
        }
      },
      elementos: [
        {
          tipo: 'grafica',
          id: 'grafica-1735296600000',
          titulo: 'Rendimiento Promedio Mensual',
          tipoGrafica: 'bar',
          color: '#A61930',
          tractorSeleccionado: 'Tractor_001',
          datos: {
            tipoOrigen: 'formula',
            // ... datos completos de configuración
          },
          configuracionAvanzada: {
            estadoGrafica: 'activa',
            fechaAplicacion: "2024-12-27T10:30:00.000Z",
            origenPlantilla: true
          },
          parametrosFormula: [
            {
              letra: 'A',
              columnaAsignada: 'RendimientoDiario',
              posicion: 0,
              procesado: true,
              fechaAplicacion: "2024-12-27T10:30:00.000Z"
            }
          ]
        }
        // ... más elementos
      ],
      estadisticas: {
        elementosTotal: 3,
        elementosAplicados: 3,
        graficasConDatos: 2,
        formulasIncluidas: ["Promedio_Rendimiento_Mensual"],
        textosIncluidos: 1,
        tractoresReferenciados: ["Tractor_001"],
        hojasUtilizadas: ["DatosRendimiento", "DatosRegionales"]
      },
      compatibilidad: {
        esCompatible: true,
        advertencias: [],
        diferencias: [],
        hojasComunes: ["DatosRendimiento", "DatosRegionales"],
        hojasFaltantes: []
      },
      formulasAsociadas: [
        {
          IdFormula: 123,
          IdGrafica: 789,
          NombreFormula: "Promedio_Rendimiento_Mensual",
          EstructuraFormula: "=PROMEDIO(A:A)",
          Parametros: [
            { letra: 'A', columnaAsignada: 'RendimientoDiario', estaAsignado: true }
          ],
          ResultadosEjemplo: [85.2, 87.1, 89.3, 86.7],
          EstadoFormula: "activa"
        }
      ]
    }
  },

  // Ejemplo 3: Caso de incompatibilidad de datos
  casoIncompatibilidad: {
    url: 'POST /plantillas/cargarMejorada/aplicar',
    body: {
      idPlantilla: 456,
      datosActuales: JSON.stringify({
        "DatosNuevos": ["Mantenimiento", "Combustible"],
        "HojaDiferente": ["OtrosDatos"]
        // Faltan "DatosRendimiento" y "DatosRegionales"
      }),
      validarCompatibilidad: true
    },
    respuestaEsperada: {
      mensaje: "Plantilla cargada con advertencias de compatibilidad",
      exito: true,
      // ... otros campos
      compatibilidad: {
        esCompatible: false,
        advertencias: [
          'La hoja "DatosRendimiento" no está disponible en los datos actuales',
          'La hoja "DatosRegionales" no está disponible en los datos actuales'
        ],
        diferencias: ['Faltan hojas de datos requeridas por la plantilla'],
        hojasComunes: [],
        hojasFaltantes: ["DatosRendimiento", "DatosRegionales"]
      },
      advertencias: [
        'La hoja "DatosRendimiento" no está disponible en los datos actuales',
        'La hoja "DatosRegionales" no está disponible en los datos actuales'
      ]
    }
  },

  // Ejemplo 4: Consultar plantilla completa (compatibilidad hacia atrás)
  consultarPlantillaCompleta: {
    url: 'POST /plantillas/cargarMejorada',
    body: {
      idPlantilla: 456
    },
    respuestaEsperada: {
      mensaje: "Consulta de plantilla exitosa",
      plantilla: {
        plantilla: {
          id: 456,
          nombrePlantilla: "Reporte Completo Tractores Q4 2024",
          frecuenciaEnvio: 168,
          correoDestino: "gerencia@tractech.com",
          numeroDestino: "",
          htmlString: "<div>Reporte generado...</div>"
        },
        datos: [
          // ... elementos con toda la información extendida
        ]
      }
    }
  }
};

// Instrucciones de prueba
const instruccionesPrueba = {
  "prerequisitos": [
    "1. Ejecutar el script de migración: plantillas/data/migraciones/001_sistema_plantillas_mejorado.sql",
    "2. Reiniciar el servidor backend",
    "3. Verificar que las nuevas rutas estén disponibles en /plantillas"
  ],
  
  "secuenciaPrueba": [
    "1. Probar endpoint GET /plantillas para ver las nuevas características",
    "2. Guardar una plantilla usando el ejemplo 'guardarPlantillaMejorada'",
    "3. Cargar la plantilla con datos compatibles usando 'cargarPlantillaMejorada'",
    "4. Probar incompatibilidad usando 'casoIncompatibilidad'",
    "5. Verificar que las plantillas existentes sigan funcionando"
  ],
  
  "validaciones": [
    "✓ Respuestas incluyen estadísticas detalladas",
    "✓ Fórmulas se guardan y recuperan correctamente",
    "✓ Validación de compatibilidad funciona",
    "✓ Configuración avanzada se mantiene",
    "✓ Compatibilidad hacia atrás preservada"
  ]
};

module.exports = {
  ejemplos,
  instruccionesPrueba
};
