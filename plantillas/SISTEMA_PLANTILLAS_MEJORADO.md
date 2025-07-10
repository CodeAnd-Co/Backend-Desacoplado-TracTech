# Sistema de Plantillas Mejorado - Backend TracTech

## Descripción General

El backend del sistema de plantillas ha sido actualizado para ser completamente congruente con el sistema de plantillas mejorado del frontend. Esta actualización incluye captura completa de configuración, manejo de fórmulas, validación de compatibilidad y trazabilidad completa.

## Nuevas Características

### 1. Modelo de Gráfica Extendido
El modelo `modeloGráfica.js` ahora incluye campos adicionales:

- **Color**: Color personalizado de la gráfica
- **TractorSeleccionado**: Tractor específico asociado
- **TipoOrigen**: Si los datos vienen de columna o fórmula
- **ColumnaOrigen**: Información detallada de la columna de origen
- **FormulaAplicada**: Datos completos de la fórmula aplicada
- **Filtros**: Filtros y parámetros aplicados
- **ParametrosFormula**: Parámetros específicos de fórmulas
- **ConfiguracionAvanzada**: Configuración visual y funcional extendida

### 2. Gestión de Fórmulas
Nuevo modelo `modeloFormulasPlantilla.js` que maneja:

- Fórmulas asociadas a gráficas específicas
- Estructura completa de fórmulas con parámetros
- Resultados de ejemplo
- Estado de las fórmulas (activa/inactiva/error)

### 3. Controlador Mejorado
El controlador `guardarPlantillasControlador.js` ahora incluye:

- **Validación completa** de configuración de plantillas
- **Captura de información de fórmulas** con estadísticas
- **Procesamiento de configuración avanzada** para cada elemento
- **Respuestas detalladas** con estadísticas y metadatos

### 4. Carga y Aplicación Avanzada
Nuevo controlador `cargarPlantillaMejoradaControlador.js` que proporciona:

- **Validación de compatibilidad** entre plantilla y datos actuales
- **Procesamiento de configuración avanzada** para elementos
- **Aplicación específica de parámetros** de fórmulas
- **Generación de estadísticas** de aplicación

## Estructura de Datos

### Gráfica Mejorada
```javascript
{
  tipo: 'grafica',
  id: 'tarjeta-grafica-123',
  titulo: 'Rendimiento por mes',
  tipoGrafica: 'bar',
  color: '#A61930',
  tractorSeleccionado: 'Tractor_001',
  datos: {
    tipoOrigen: 'formula',
    columna: {
      nombre: 'Rendimiento_Total',
      hoja: 'Hoja1',
      indiceColumna: 2
    },
    formula: {
      nombre: 'Promedio_Rendimiento',
      estructuraFormula: '=PROMEDIO(A:A)',
      resultados: [...]
    },
    filtros: [
      { parametro: 'A', columna: 'Fecha', indice: 0 },
      { parametro: 'B', columna: 'Region', indice: 1 }
    ],
    parametrosFormula: [
      { letra: 'A', columnaAsignada: 'Fecha', posicion: 0 }
    ]
  },
  configuracionAvanzada: {
    estadoGrafica: 'activa',
    tieneDatos: true,
    chartConfig: { ... }
  }
}
```

## API Endpoints

### Guardar Plantilla Mejorada
```
POST /plantillas/guardar
```

**Request:**
```javascript
{
  plantilla: {
    nombrePlantilla: "Reporte Mensual Mejorado",
    descripcion: "Reporte con análisis avanzado",
    datos: [ /* elementos con configuración completa */ ]
  }
}
```

**Response:**
```javascript
{
  mensaje: "Plantilla guardada exitosamente",
  exito: true,
  id: 123,
  estadisticas: {
    totalElementos: 5,
    graficasConDatos: 3,
    formulasAplicadas: 2,
    formulasIncluidas: ["Promedio_Rendimiento", "Suma_Total"]
  },
  informacionFormulas: {
    totalFormulas: 2,
    tiposFormula: ["Promedio_Rendimiento", "Suma_Total"],
    hojasUtilizadas: ["Hoja1", "Hoja2"]
  }
}
```

### Cargar y Aplicar Plantilla
```
POST /plantillas/cargarMejorada/aplicar
```

**Request:**
```javascript
{
  idPlantilla: 123,
  datosActuales: "{ /* estructura de datos actual */ }",
  validarCompatibilidad: true
}
```

**Response:**
```javascript
{
  mensaje: "Plantilla cargada exitosamente",
  exito: true,
  plantilla: { /* datos de la plantilla */ },
  elementos: [ /* elementos procesados para aplicar */ ],
  estadisticas: {
    elementosAplicados: 5,
    graficasConDatos: 3,
    formulasIncluidas: ["Promedio_Rendimiento"],
    tractoresReferenciados: ["Tractor_001"]
  },
  compatibilidad: {
    esCompatible: true,
    hojasComunes: ["Hoja1"],
    advertencias: []
  },
  formulasAsociadas: [ /* fórmulas detalladas */ ]
}
```

## Migración de Base de Datos

Para usar el sistema mejorado, ejecutar el script:
```sql
plantillas/data/migraciones/001_sistema_plantillas_mejorado.sql
```

Este script:
1. Agrega nuevas columnas a la tabla `grafica`
2. Crea la tabla `formulasplantilla`
3. Crea la tabla `plantillametadatos` (opcional)
4. Actualiza datos existentes para compatibilidad

## Validaciones Implementadas

### 1. Validación de Configuración
- Verifica elementos válidos en la plantilla
- Cuenta gráficas con datos aplicados
- Identifica fórmulas utilizadas
- Detecta textos vacíos

### 2. Compatibilidad de Datos
- Compara estructura de hojas entre plantilla y datos actuales
- Verifica existencia de hojas específicas
- Genera advertencias sobre diferencias

### 3. Integridad de Fórmulas
- Valida estructura de fórmulas
- Verifica parámetros requeridos
- Mantiene trazabilidad de aplicación

## Beneficios del Sistema Mejorado

### Para el Frontend
- **Fidelidad completa**: Restaura exactamente el estado original
- **Información rica**: Acceso a metadatos y configuración detallada
- **Validación proactiva**: Advertencias antes de aplicar plantillas incompatibles

### Para el Backend
- **Trazabilidad completa**: Registro detallado de configuraciones
- **Extensibilidad**: Estructura modular para nuevas características
- **Compatibilidad**: Mantiene funcionamiento con plantillas existentes

### Para Usuarios
- **Reutilización eficiente**: Plantillas funcionan en diferentes contextos
- **Transparencia**: Información clara sobre compatibilidad
- **Flexibilidad**: Aplicación parcial cuando hay incompatibilidades

## Ejemplos de Uso

### Crear una Plantilla con Fórmulas
```javascript
const plantilla = {
  nombrePlantilla: "Análisis Avanzado Tractores",
  datos: [
    {
      tipoContenido: 'Grafica',
      nombreGrafica: 'Rendimiento Promedio',
      tipoGrafica: 'bar',
      color: '#A61930',
      tractorSeleccionado: 'Tractor_001',
      datos: {
        tipoOrigen: 'formula',
        formula: {
          nombre: 'Promedio_Rendimiento',
          estructuraFormula: '=PROMEDIO(A:A)'
        },
        parametrosFormula: [
          { letra: 'A', columnaAsignada: 'Rendimiento', posicion: 0 }
        ]
      }
    }
  ]
};

const resultado = await guardarPlantilla(plantilla);
```

### Aplicar Plantilla con Validación
```javascript
const aplicacion = await cargarYAplicarPlantilla({
  idPlantilla: 123,
  datosActuales: JSON.stringify(datosHojaActual),
  validarCompatibilidad: true
});

if (aplicacion.compatibilidad.esCompatible) {
  // Aplicar todos los elementos
  aplicarElementos(aplicacion.elementos);
} else {
  // Mostrar advertencias y permitir aplicación parcial
  mostrarAdvertencias(aplicacion.compatibilidad.advertencias);
}
```

## Mantenimiento

### Logs y Monitoreo
- Errores de validación se registran en consola
- Estadísticas de uso disponibles en respuestas
- Trazabilidad completa de aplicaciones

### Actualizaciones Futuras
- Sistema preparado para nuevos tipos de contenido
- Estructura extensible para metadatos adicionales
- Compatibilidad hacia atrás garantizada

## Consideraciones de Rendimiento

- Campos JSON optimizados para consulta
- Índices en tablas de fórmulas y metadatos
- Validación de compatibilidad opcional para mejor rendimiento
- Procesamiento asíncrono de elementos complejos
