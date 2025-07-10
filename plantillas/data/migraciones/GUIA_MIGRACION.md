# Guía de Migración de Base de Datos - Sistema de Plantillas Mejorado

## 📋 Descripción

Esta guía te ayudará a migrar tu base de datos de TracTech para que sea compatible con el Sistema de Plantillas Mejorado. Incluye dos enfoques: migración completa y migración incremental.

## 🎯 Estructura de Datos Basada en tu Ejemplo

La base de datos está diseñada para soportar exactamente la estructura que mostraste en tu archivo de ejemplos:

```javascript
// Ejemplo de tu estructura
{
  nombrePlantilla: "Reporte Completo Tractores Q4 2024",
  datos: [
    {
      ordenContenido: 1,
      tipoContenido: 'Grafica',
      nombreGrafica: 'Rendimiento Promedio Mensual',
      color: '#A61930',
      tractorSeleccionado: 'Tractor_001',
      datos: {
        tipoOrigen: 'formula',
        columna: { nombre: 'Rendimiento_Total', hoja: 'DatosRendimiento' },
        formula: { nombre: 'Promedio_Rendimiento_Mensual', estructuraFormula: '=PROMEDIO(A:A)' },
        filtros: [{ parametro: 'A', columna: 'Fecha', indice: 0 }],
        parametrosFormula: [{ letra: 'A', columnaAsignada: 'RendimientoDiario' }]
      },
      configuracionAvanzada: { estadoGrafica: 'activa', tieneDatos: true }
    }
  ]
}
```

## 📁 Archivos de Migración Disponibles

### 1. **002_estructura_completa_sistema_mejorado.sql**
- **Uso**: Para nuevas instalaciones o recreación completa
- **Qué hace**: Crea toda la estructura desde cero
- **Incluye**: Todas las tablas, vistas, procedimientos y datos de ejemplo

### 2. **003_migracion_incremental.sql**
- **Uso**: Para sistemas existentes con datos
- **Qué hace**: Solo agrega campos y tablas nuevas
- **Preserva**: Todos los datos existentes

## 🚀 Instrucciones de Migración

### Opción A: Nueva Instalación (Recomendado para desarrollo)

```sql
-- 1. Conectar a tu base de datos MySQL
mysql -u tu_usuario -p tu_base_datos

-- 2. Ejecutar el script completo
source plantillas/data/migraciones/002_estructura_completa_sistema_mejorado.sql

-- 3. Verificar la instalación
SELECT 'Instalación completada' as Estado;
```

### Opción B: Migración Incremental (Para sistemas en producción)

```sql
-- 1. HACER BACKUP PRIMERO
mysqldump -u tu_usuario -p tu_base_datos > backup_antes_migracion.sql

-- 2. Ejecutar migración incremental
source plantillas/data/migraciones/003_migracion_incremental.sql

-- 3. Verificar que todo funciona
SELECT * FROM vista_plantillas_resumen LIMIT 5;
```

## 📊 Tablas Creadas/Modificadas

### Tablas Principales

| Tabla | Descripción | Nuevos Campos |
|-------|-------------|---------------|
| `plantilla` | Plantillas principales | Mantiene estructura original |
| `plantillareporte` | Reportes específicos | Mantiene estructura original |
| `contenido` | Elementos de contenido | Mantiene estructura original |
| `grafica` | **MODIFICADA** | +8 campos nuevos para sistema mejorado |

### Nuevas Tablas

| Tabla | Propósito | Campos Clave |
|-------|-----------|--------------|
| `formulasplantilla` | Fórmulas asociadas a gráficas | IdGrafica, NombreFormula, EstructuraFormula, Parametros |
| `plantillametadatos` | Metadatos y estadísticas | TractoresUtilizados, HojasUtilizadas, FormulasResumen |
| `historial_aplicaciones` | Auditoría de aplicaciones | UsuarioAplicacion, CompatibilidadDatos, Advertencias |

### Campos Nuevos en tabla `grafica`

```sql
-- Campos de configuración visual
Color VARCHAR(7) DEFAULT '#A61930'
TractorSeleccionado VARCHAR(100) DEFAULT NULL

-- Configuración de origen de datos
TipoOrigen ENUM('columna', 'formula') DEFAULT 'columna'
ColumnaOrigen JSON DEFAULT NULL        -- {nombre, hoja, indiceColumna}
FormulaAplicada JSON DEFAULT NULL      -- {nombre, estructuraFormula, resultados}

-- Configuración avanzada
Filtros JSON DEFAULT NULL             -- [{parametro, columna, indice}]
ParametrosFormula JSON DEFAULT NULL   -- [{letra, columnaAsignada, posicion}]
ConfiguracionAvanzada JSON DEFAULT NULL -- {estadoGrafica, tieneDatos, chartConfig}

-- Auditoría
FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
FechaModificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
UsuarioCreacion VARCHAR(100) DEFAULT NULL
```

## 🧪 Verificación de la Migración

### 1. Verificar Estructura

```sql
-- Verificar que las nuevas columnas existen
DESCRIBE grafica;

-- Verificar nuevas tablas
SHOW TABLES LIKE '%formula%';
SHOW TABLES LIKE '%metadatos%';
```

### 2. Probar Funcionalidad

```sql
-- Verificar datos de prueba insertados
SELECT * FROM grafica WHERE IdGrafica = 9999;
SELECT * FROM formulasplantilla WHERE IdFormula = 9999;
SELECT * FROM plantillametadatos WHERE IdPlantilla = 999;
```

### 3. Usar Vistas Creadas

```sql
-- Ver resumen de plantillas
SELECT * FROM vista_plantillas_resumen;

-- Ver gráficas completas
SELECT * FROM vista_graficas_completas LIMIT 5;
```

## 🔧 Configuración del Backend

Después de la migración, asegúrate de que el backend esté configurado:

1. **Reiniciar el servidor backend**
2. **Verificar que las nuevas rutas funcionen**:
   ```bash
   curl http://localhost:3000/plantillas
   # Debe mostrar el mensaje con las nuevas características
   ```

## 📋 Datos de Ejemplo Incluidos

La migración incluye una plantilla de ejemplo que coincide exactamente con tu estructura:

```sql
-- Plantilla: "Reporte Completo Tractores Q4 2024"
-- ID: 456 (idPlantillaReporte)
-- Incluye:
--   - Gráfica con fórmula: "Rendimiento Promedio Mensual"
--   - Texto: "Análisis de Rendimiento Q4 2024" 
--   - Gráfica con columna: "Distribución por Región"
--   - Fórmula asociada: "Promedio_Rendimiento_Mensual"
--   - Metadatos completos
```

## 🚨 Troubleshooting

### Errores Comunes

1. **"Table doesn't exist"**
   ```sql
   -- Verificar que estás en la base de datos correcta
   SELECT DATABASE();
   USE tu_base_datos_tractech;
   ```

2. **"Column already exists"**
   - Es normal, el script está diseñado para ser seguro
   - Usa `IF NOT EXISTS` para evitar conflictos

3. **"Cannot add foreign key constraint"**
   ```sql
   -- Verificar que las tablas referenciadas existen
   SHOW TABLES LIKE 'plantilla';
   SHOW TABLES LIKE 'grafica';
   ```

### Verificación de Compatibilidad

```sql
-- Verificar versión de MySQL (debe ser 5.7+ para JSON)
SELECT VERSION();

-- Verificar charset (debe ser utf8mb4)
SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME 
FROM INFORMATION_SCHEMA.SCHEMATA 
WHERE SCHEMA_NAME = DATABASE();
```

## 🎯 Próximos Pasos

1. **Ejecutar la migración** usando uno de los scripts
2. **Probar el endpoint** `GET /plantillas` para ver las nuevas características
3. **Usar los ejemplos** en `ejemplosUsoSistemaMejorado.js` para probar
4. **Guardar una plantilla** con la nueva estructura
5. **Cargar la plantilla** usando la funcionalidad mejorada

## 📞 Soporte

Si encuentras problemas:

1. Verificar que tienes permisos de `ALTER TABLE` y `CREATE TABLE`
2. Revisar los logs de MySQL para errores específicos
3. Usar el script incremental si el completo falla
4. Verificar la versión de MySQL (recomendado: 5.7+)

---

**¡La base de datos estará lista para soportar todo el sistema de plantillas mejorado que desarrollaste en el frontend!** 🚀
