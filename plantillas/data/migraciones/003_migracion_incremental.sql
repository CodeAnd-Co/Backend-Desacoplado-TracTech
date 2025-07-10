-- Script de migración incremental para sistemas existentes
-- Solo agrega los campos necesarios sin crear tablas desde cero
-- Ejecutar SOLO si ya tienes una base de datos TracTech funcionando

-- ==================================================
-- VERIFICACIÓN PREVIA
-- ==================================================

-- Verificar que las tablas principales existen
SELECT 
    CASE 
        WHEN COUNT(*) >= 4 THEN '✅ Tablas principales encontradas'
        ELSE '❌ ERROR: Faltan tablas principales. Usar script completo 002_estructura_completa_sistema_mejorado.sql'
    END as EstadoVerificacion
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME IN ('plantilla', 'plantillareporte', 'contenido', 'grafica');

-- ==================================================
-- MODIFICACIÓN DE TABLA GRAFICA (SI EXISTE)
-- ==================================================

-- Verificar si la tabla grafica existe y agregar columnas nuevas
SET @sql = (
    SELECT CASE 
        WHEN COUNT(*) > 0 THEN 
            'ALTER TABLE grafica 
             ADD COLUMN IF NOT EXISTS Color VARCHAR(7) DEFAULT "#A61930" COMMENT "Color hexadecimal de la gráfica",
             ADD COLUMN IF NOT EXISTS TractorSeleccionado VARCHAR(100) DEFAULT NULL COMMENT "ID o nombre del tractor seleccionado",
             ADD COLUMN IF NOT EXISTS TipoOrigen ENUM("columna", "formula") DEFAULT "columna" COMMENT "Tipo de origen de los datos",
             ADD COLUMN IF NOT EXISTS ColumnaOrigen JSON DEFAULT NULL COMMENT "Información de la columna de origen",
             ADD COLUMN IF NOT EXISTS FormulaAplicada JSON DEFAULT NULL COMMENT "Información de la fórmula aplicada",
             ADD COLUMN IF NOT EXISTS Filtros JSON DEFAULT NULL COMMENT "Filtros aplicados",
             ADD COLUMN IF NOT EXISTS ParametrosFormula JSON DEFAULT NULL COMMENT "Parámetros específicos de la fórmula",
             ADD COLUMN IF NOT EXISTS ConfiguracionAvanzada JSON DEFAULT NULL COMMENT "Configuración avanzada de la gráfica",
             ADD COLUMN IF NOT EXISTS FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
             ADD COLUMN IF NOT EXISTS FechaModificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
             ADD COLUMN IF NOT EXISTS UsuarioCreacion VARCHAR(100) DEFAULT NULL COMMENT "Usuario que creó la gráfica";'
        ELSE 'SELECT "Tabla grafica no existe - usar script completo" as mensaje;'
    END
    FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'grafica'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ==================================================
-- CREAR TABLA FORMULASPLANTILLA (SI NO EXISTE)
-- ==================================================

CREATE TABLE IF NOT EXISTS formulasplantilla (
    IdFormula INT AUTO_INCREMENT PRIMARY KEY,
    IdGrafica INT NOT NULL,
    NombreFormula VARCHAR(255) NOT NULL COMMENT 'Nombre de la fórmula aplicada',
    EstructuraFormula TEXT NOT NULL COMMENT 'Estructura completa de la fórmula (ej: =PROMEDIO(A:A))',
    TipoFormula ENUM('PROMEDIO', 'SUMA', 'CONTAR', 'MAX', 'MIN', 'PERSONALIZADA') DEFAULT 'PERSONALIZADA',
    Parametros JSON DEFAULT NULL COMMENT 'Parámetros de la fórmula con detalle',
    ResultadosEjemplo JSON DEFAULT NULL COMMENT 'Ejemplos de resultados de la fórmula',
    RangoDatos VARCHAR(100) DEFAULT NULL COMMENT 'Rango de datos de origen',
    ConfiguracionAplicacion JSON DEFAULT NULL COMMENT 'Configuración específica de aplicación',
    EstadoFormula ENUM('activa', 'inactiva', 'error', 'pendiente') DEFAULT 'activa',
    MensajeError TEXT DEFAULT NULL COMMENT 'Mensaje de error si la fórmula falló',
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaModificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FechaUltimaEjecucion TIMESTAMP NULL DEFAULT NULL,
    
    -- Solo agregar FK si la tabla grafica existe
    INDEX idx_grafica_formula (IdGrafica),
    INDEX idx_nombre_formula (NombreFormula),
    INDEX idx_tipo_formula (TipoFormula),
    INDEX idx_estado_formula (EstadoFormula)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Fórmulas asociadas a gráficas en plantillas';

-- Agregar FK solo si ambas tablas existen
SET @sql_fk = (
    SELECT CASE 
        WHEN COUNT(*) = 2 THEN 
            'ALTER TABLE formulasplantilla ADD CONSTRAINT fk_formulasplantilla_grafica 
             FOREIGN KEY (IdGrafica) REFERENCES grafica(IdGrafica) ON DELETE CASCADE;'
        ELSE 'SELECT "No se puede crear FK - tabla grafica no existe" as mensaje;'
    END
    FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME IN ('grafica', 'formulasplantilla')
);

PREPARE stmt_fk FROM @sql_fk;
EXECUTE stmt_fk;
DEALLOCATE PREPARE stmt_fk;

-- ==================================================
-- CREAR TABLA PLANTILLAMETADATOS (SI NO EXISTE)
-- ==================================================

CREATE TABLE IF NOT EXISTS plantillametadatos (
    IdMetadato INT AUTO_INCREMENT PRIMARY KEY,
    IdPlantilla INT NOT NULL,
    TractoresUtilizados JSON DEFAULT NULL COMMENT 'Lista de tractores referenciados',
    HojasUtilizadas JSON DEFAULT NULL COMMENT 'Lista de hojas de datos utilizadas',
    FormulasResumen JSON DEFAULT NULL COMMENT 'Resumen de fórmulas utilizadas',
    EstadisticasCreacion JSON DEFAULT NULL COMMENT 'Estadísticas al momento de crear',
    HojasRequeridas JSON DEFAULT NULL COMMENT 'Hojas requeridas para funcionar',
    ColumnasRequeridas JSON DEFAULT NULL COMMENT 'Columnas específicas requeridas',
    VersionCompatibilidad VARCHAR(10) DEFAULT '2.0' COMMENT 'Versión mínima compatible',
    VersionPlantilla VARCHAR(10) DEFAULT '2.0' COMMENT 'Versión del sistema',
    EntornoCreacion ENUM('desarrollo', 'pruebas', 'produccion') DEFAULT 'produccion',
    VecesAplicada INT DEFAULT 0 COMMENT 'Cuántas veces se ha aplicado',
    FechaUltimaAplicacion TIMESTAMP NULL DEFAULT NULL,
    UsuariosQueAplicaron JSON DEFAULT NULL COMMENT 'Usuarios que han aplicado',
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaModificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_plantilla_metadatos (IdPlantilla),
    INDEX idx_version_plantilla (VersionPlantilla),
    INDEX idx_fecha_ultima_aplicacion (FechaUltimaAplicacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Metadatos extendidos para plantillas del sistema mejorado';

-- Agregar FK para metadatos si la tabla plantilla existe
SET @sql_fk_meta = (
    SELECT CASE 
        WHEN COUNT(*) >= 1 THEN 
            'ALTER TABLE plantillametadatos ADD CONSTRAINT fk_plantillametadatos_plantilla 
             FOREIGN KEY (IdPlantilla) REFERENCES plantilla(idPlantilla) ON DELETE CASCADE;'
        ELSE 'SELECT "No se puede crear FK para metadatos - tabla plantilla no existe" as mensaje;'
    END
    FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'plantilla'
);

PREPARE stmt_fk_meta FROM @sql_fk_meta;
EXECUTE stmt_fk_meta;
DEALLOCATE PREPARE stmt_fk_meta;

-- ==================================================
-- ACTUALIZAR DATOS EXISTENTES CON VALORES DEFAULT
-- ==================================================

-- Solo actualizar si la tabla grafica tiene las nuevas columnas
SET @sql_update = (
    SELECT CASE 
        WHEN COUNT(*) >= 8 THEN 
            'UPDATE grafica 
             SET Color = COALESCE(Color, "#A61930"),
                 TipoOrigen = COALESCE(TipoOrigen, "columna"),
                 ColumnaOrigen = COALESCE(ColumnaOrigen, "{}"),
                 FormulaAplicada = COALESCE(FormulaAplicada, "{}"),
                 Filtros = COALESCE(Filtros, "[]"),
                 ParametrosFormula = COALESCE(ParametrosFormula, "[]"),
                 ConfiguracionAvanzada = COALESCE(ConfiguracionAvanzada, "{}"),
                 FechaCreacion = COALESCE(FechaCreacion, NOW())
             WHERE IdGrafica IS NOT NULL;'
        ELSE 'SELECT "No se pueden actualizar datos - columnas nuevas no existen" as mensaje;'
    END
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'grafica' 
    AND COLUMN_NAME IN ('Color', 'TipoOrigen', 'ColumnaOrigen', 'FormulaAplicada', 'Filtros', 'ParametrosFormula', 'ConfiguracionAvanzada', 'FechaCreacion')
);

PREPARE stmt_update FROM @sql_update;
EXECUTE stmt_update;
DEALLOCATE PREPARE stmt_update;

-- ==================================================
-- AGREGAR ÍNDICES OPTIMIZADOS
-- ==================================================

-- Índices para la tabla grafica (solo si las columnas existen)
SET @sql_indices = (
    SELECT CASE 
        WHEN COUNT(*) >= 3 THEN 
            'ALTER TABLE grafica 
             ADD INDEX IF NOT EXISTS idx_tractor_seleccionado (TractorSeleccionado),
             ADD INDEX IF NOT EXISTS idx_tipo_origen (TipoOrigen),
             ADD INDEX IF NOT EXISTS idx_fecha_creacion_grafica (FechaCreacion);'
        ELSE 'SELECT "No se pueden crear índices - columnas no existen" as mensaje;'
    END
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'grafica' 
    AND COLUMN_NAME IN ('TractorSeleccionado', 'TipoOrigen', 'FechaCreacion')
);

PREPARE stmt_indices FROM @sql_indices;
EXECUTE stmt_indices;
DEALLOCATE PREPARE stmt_indices;

-- ==================================================
-- INSERTAR DATOS DE PRUEBA BASADOS EN TU EJEMPLO
-- ==================================================

-- Solo insertar si las tablas están completas
SET @sql_insert_test = (
    SELECT CASE 
        WHEN COUNT(DISTINCT TABLE_NAME) >= 4 THEN 
            'INSERT IGNORE INTO plantilla (idPlantilla, NombrePlantilla, FrecuenciaEnvio, CorreoDestino) 
             VALUES (999, "Plantilla de Prueba Sistema Mejorado", 168, "test@tractech.com");
             
             INSERT IGNORE INTO plantillareporte (idPlantillaReporte, IdPlantilla, Nombre, Descripcion) 
             VALUES (9999, 999, "Reporte de Prueba", "Prueba del sistema mejorado");
             
             INSERT IGNORE INTO contenido (IdContenido, IdPlantilla, OrdenContenido, TipoContenido) 
             VALUES (9999, 999, 1, "Grafica");'
        ELSE 'SELECT "No se pueden insertar datos de prueba - tablas incompletas" as mensaje;'
    END
    FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME IN ('plantilla', 'plantillareporte', 'contenido', 'grafica')
);

PREPARE stmt_insert_test FROM @sql_insert_test;
EXECUTE stmt_insert_test;
DEALLOCATE PREPARE stmt_insert_test;

-- Insertar gráfica de prueba con la nueva estructura
INSERT IGNORE INTO grafica (
    IdGrafica, IdContenido, NombreGrafica, TipoGrafica, 
    Color, TractorSeleccionado, TipoOrigen,
    ColumnaOrigen, FormulaAplicada, Filtros, ParametrosFormula, ConfiguracionAvanzada
) VALUES (
    9999, 9999, 'Gráfica de Prueba Sistema Mejorado', 'Barras',
    '#A61930', 'Tractor_Test_001', 'formula',
    '{"nombre": "Rendimiento_Test", "hoja": "DatosPrueba", "indiceColumna": 1}',
    '{"nombre": "Promedio_Test", "estructuraFormula": "=PROMEDIO(A:A)", "resultados": [80, 85, 90]}',
    '[{"parametro": "A", "columna": "FechaPrueba", "indice": 0}]',
    '[{"letra": "A", "columnaAsignada": "RendimientoPrueba", "posicion": 0, "estaAsignado": true}]',
    '{"estadoGrafica": "activa", "tieneDatos": true, "esTest": true}'
);

-- Insertar fórmula de prueba
INSERT IGNORE INTO formulasplantilla (
    IdFormula, IdGrafica, NombreFormula, EstructuraFormula, TipoFormula,
    Parametros, ResultadosEjemplo, EstadoFormula
) VALUES (
    9999, 9999, 'Formula_Prueba_Sistema', '=PROMEDIO(A:A)', 'PROMEDIO',
    '[{"letra": "A", "columnaAsignada": "RendimientoPrueba", "estaAsignado": true}]',
    '[80, 85, 90]', 'activa'
);

-- Insertar metadatos de prueba
INSERT IGNORE INTO plantillametadatos (
    IdPlantilla, TractoresUtilizados, HojasUtilizadas, FormulasResumen,
    EstadisticasCreacion, VersionPlantilla
) VALUES (
    999,
    '["Tractor_Test_001"]',
    '["DatosPrueba"]',
    '{"tiposFormula": ["Formula_Prueba_Sistema"], "totalFormulas": 1}',
    '{"totalElementos": 1, "graficasConDatos": 1, "formulasAplicadas": 1, "esTest": true}',
    '2.0'
);

-- ==================================================
-- VERIFICACIÓN FINAL DE LA MIGRACIÓN
-- ==================================================

-- Verificar que las nuevas columnas existen
SELECT 
    'grafica' as Tabla,
    COUNT(*) as ColumnasNuevas,
    CASE 
        WHEN COUNT(*) >= 8 THEN '✅ Migración exitosa'
        ELSE '⚠️ Migración parcial'
    END as Estado
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'grafica' 
AND COLUMN_NAME IN ('Color', 'TractorSeleccionado', 'TipoOrigen', 'ColumnaOrigen', 'FormulaAplicada', 'Filtros', 'ParametrosFormula', 'ConfiguracionAvanzada')

UNION ALL

-- Verificar que las nuevas tablas existen
SELECT 
    'Nuevas tablas' as Tabla,
    COUNT(*) as TablasCreadas,
    CASE 
        WHEN COUNT(*) >= 2 THEN '✅ Tablas creadas'
        ELSE '❌ Error en creación'
    END as Estado
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME IN ('formulasplantilla', 'plantillametadatos');

-- Mostrar estructura actualizada de la tabla grafica
DESCRIBE grafica;

-- Mostrar ejemplo de datos insertados
SELECT 
    'Datos de prueba insertados' as Resultado,
    (SELECT COUNT(*) FROM grafica WHERE IdGrafica = 9999) as GraficaPrueba,
    (SELECT COUNT(*) FROM formulasplantilla WHERE IdFormula = 9999) as FormulaPrueba,
    (SELECT COUNT(*) FROM plantillametadatos WHERE IdPlantilla = 999) as MetadatosPrueba;

-- Mensaje final
SELECT 
    '🎉 Migración incremental completada' as Estado,
    'Las tablas existentes fueron actualizadas exitosamente' as Descripcion,
    'Ahora el backend es compatible con el sistema mejorado' as Resultado,
    NOW() as FechaMigracion;
