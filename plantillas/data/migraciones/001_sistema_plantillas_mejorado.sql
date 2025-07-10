-- Migración para actualizar la tabla de gráficas con campos del sistema mejorado
-- Ejecutar este script para agregar los nuevos campos requeridos

-- 1. Agregar nuevas columnas a la tabla grafica
ALTER TABLE grafica 
ADD COLUMN Color VARCHAR(7) DEFAULT '#A61930' COMMENT 'Color hexadecimal de la gráfica',
ADD COLUMN TractorSeleccionado VARCHAR(100) DEFAULT NULL COMMENT 'ID o nombre del tractor seleccionado',
ADD COLUMN TipoOrigen ENUM('columna', 'formula') DEFAULT 'columna' COMMENT 'Tipo de origen de los datos',
ADD COLUMN ColumnaOrigen JSON DEFAULT NULL COMMENT 'Información de la columna de origen (nombre, hoja, índice)',
ADD COLUMN FormulaAplicada JSON DEFAULT NULL COMMENT 'Información de la fórmula aplicada (nombre, estructura, resultados)',
ADD COLUMN Filtros JSON DEFAULT NULL COMMENT 'Filtros aplicados (parámetros A, B, C, etc.)',
ADD COLUMN ParametrosFormula JSON DEFAULT NULL COMMENT 'Parámetros específicos de la fórmula (letra, columna, posición)',
ADD COLUMN ConfiguracionAvanzada JSON DEFAULT NULL COMMENT 'Configuración avanzada de la gráfica (chartConfig, estado, etc.)';

-- 2. Crear tabla para fórmulas de plantillas (si no existe)
CREATE TABLE IF NOT EXISTS formulasplantilla (
    IdFormula INT AUTO_INCREMENT PRIMARY KEY,
    IdGrafica INT NOT NULL,
    NombreFormula VARCHAR(255) NOT NULL COMMENT 'Nombre de la fórmula aplicada',
    EstructuraFormula TEXT NOT NULL COMMENT 'Estructura completa de la fórmula (ej: =PROMEDIO(A:A))',
    Parametros JSON DEFAULT NULL COMMENT 'Parámetros de la fórmula con detalle',
    ResultadosEjemplo JSON DEFAULT NULL COMMENT 'Ejemplos de resultados de la fórmula',
    EstadoFormula ENUM('activa', 'inactiva', 'error') DEFAULT 'activa',
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaModificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (IdGrafica) REFERENCES grafica(IdGrafica) ON DELETE CASCADE,
    INDEX idx_grafica_formula (IdGrafica),
    INDEX idx_nombre_formula (NombreFormula),
    INDEX idx_estado_formula (EstadoFormula)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Tabla para almacenar fórmulas asociadas a gráficas en plantillas';

-- 3. Crear tabla para metadatos de plantillas (opcional, para funcionalidad futura)
CREATE TABLE IF NOT EXISTS plantillametadatos (
    IdMetadato INT AUTO_INCREMENT PRIMARY KEY,
    IdPlantilla INT NOT NULL,
    TractoresUtilizados JSON DEFAULT NULL COMMENT 'Lista de tractores referenciados en la plantilla',
    HojasUtilizadas JSON DEFAULT NULL COMMENT 'Lista de hojas de datos utilizadas',
    FormulasResumen JSON DEFAULT NULL COMMENT 'Resumen de fórmulas utilizadas',
    EstadisticasCreacion JSON DEFAULT NULL COMMENT 'Estadísticas al momento de crear la plantilla',
    VersionPlantilla VARCHAR(10) DEFAULT '2.0' COMMENT 'Versión del sistema de plantillas',
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaUltimaAplicacion TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (IdPlantilla) REFERENCES plantilla(idPlantilla) ON DELETE CASCADE,
    INDEX idx_plantilla_metadatos (IdPlantilla),
    INDEX idx_version_plantilla (VersionPlantilla)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Metadatos adicionales para plantillas del sistema mejorado';

-- 4. Actualizar plantillas existentes con valores por defecto para compatibilidad
UPDATE grafica 
SET 
    Color = COALESCE(Color, '#A61930'),
    TipoOrigen = COALESCE(TipoOrigen, 'columna'),
    ColumnaOrigen = COALESCE(ColumnaOrigen, '{}'),
    FormulaAplicada = COALESCE(FormulaAplicada, '{}'),
    Filtros = COALESCE(Filtros, '[]'),
    ParametrosFormula = COALESCE(ParametrosFormula, '[]'),
    ConfiguracionAvanzada = COALESCE(ConfiguracionAvanzada, '{}')
WHERE IdGrafica IS NOT NULL;

-- 5. Verificar la migración
SELECT 
    'Migración completada exitosamente' as estado,
    COUNT(*) as graficas_actualizadas
FROM grafica 
WHERE Color IS NOT NULL;
