-- Script SQL para crear la estructura completa del Sistema de Plantillas Mejorado
-- BaseDatos: TracTech - Módulo de Plantillas de Reporte
-- Versión: 2.0 - Sistema Mejorado
-- Fecha: 2024-12-27

-- ==================================================
-- CONFIGURACIÓN INICIAL
-- ==================================================

-- Usar la base de datos (ajustar según el nombre de tu BD)
-- USE tractech_db;

-- Configurar el motor de almacenamiento y charset
SET default_storage_engine = InnoDB;
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ==================================================
-- TABLAS PRINCIPALES DEL SISTEMA DE PLANTILLAS
-- ==================================================

-- Tabla principal de plantillas (si no existe)
CREATE TABLE IF NOT EXISTS plantilla (
    idPlantilla INT AUTO_INCREMENT PRIMARY KEY,
    NombrePlantilla VARCHAR(255) NOT NULL COMMENT 'Nombre descriptivo de la plantilla',
    FrecuenciaEnvio INT DEFAULT 0 COMMENT 'Frecuencia de envío en horas (0 = manual)',
    CorreoDestino VARCHAR(255) DEFAULT NULL COMMENT 'Correo electrónico de destino',
    NumeroDestino VARCHAR(20) DEFAULT NULL COMMENT 'Número telefónico de destino',
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaModificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    EstadoPlantilla ENUM('activa', 'inactiva', 'archivada') DEFAULT 'activa',
    VersionSistema VARCHAR(10) DEFAULT '2.0' COMMENT 'Versión del sistema de plantillas',
    
    INDEX idx_nombre_plantilla (NombrePlantilla),
    INDEX idx_estado_plantilla (EstadoPlantilla),
    INDEX idx_fecha_creacion (FechaCreacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Tabla principal de plantillas de reporte - Sistema Mejorado';

-- Tabla de reportes de plantillas (si no existe)
CREATE TABLE IF NOT EXISTS plantillareporte (
    idPlantillaReporte INT AUTO_INCREMENT PRIMARY KEY,
    IdPlantilla INT NOT NULL,
    Nombre VARCHAR(255) NOT NULL COMMENT 'Nombre del reporte específico',
    Datos LONGTEXT DEFAULT NULL COMMENT 'Contenido HTML del reporte generado',
    Descripcion TEXT DEFAULT NULL COMMENT 'Descripción detallada del reporte',
    FrecuenciaEnvio INT DEFAULT 0 COMMENT 'Frecuencia específica del reporte',
    CorreoDestino VARCHAR(255) DEFAULT NULL COMMENT 'Correo específico del reporte',
    NumeroDestino VARCHAR(20) DEFAULT NULL COMMENT 'Número específico del reporte',
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaUltimaEjecucion TIMESTAMP NULL DEFAULT NULL,
    
    FOREIGN KEY (IdPlantilla) REFERENCES plantilla(idPlantilla) ON DELETE CASCADE,
    INDEX idx_plantilla_reporte (IdPlantilla),
    INDEX idx_nombre_reporte (Nombre),
    INDEX idx_fecha_ultima_ejecucion (FechaUltimaEjecucion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Reportes específicos asociados a plantillas';

-- Tabla de contenidos de plantillas
CREATE TABLE IF NOT EXISTS contenido (
    IdContenido INT AUTO_INCREMENT PRIMARY KEY,
    IdPlantilla INT NOT NULL,
    OrdenContenido INT NOT NULL COMMENT 'Orden de aparición en la plantilla (1, 2, 3...)',
    TipoContenido ENUM('Grafica', 'Texto', 'Tabla', 'Imagen') NOT NULL COMMENT 'Tipo de elemento de contenido',
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    EstadoContenido ENUM('activo', 'inactivo') DEFAULT 'activo',
    
    FOREIGN KEY (IdPlantilla) REFERENCES plantilla(idPlantilla) ON DELETE CASCADE,
    INDEX idx_plantilla_contenido (IdPlantilla),
    INDEX idx_orden_contenido (OrdenContenido),
    INDEX idx_tipo_contenido (TipoContenido),
    UNIQUE KEY uk_plantilla_orden (IdPlantilla, OrdenContenido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Contenidos individuales de las plantillas (gráficas, textos, etc.)';

-- ==================================================
-- TABLA DE GRÁFICAS - VERSIÓN MEJORADA
-- ==================================================

CREATE TABLE IF NOT EXISTS grafica (
    IdGrafica INT AUTO_INCREMENT PRIMARY KEY,
    IdContenido INT NOT NULL,
    
    -- Campos básicos (compatibilidad hacia atrás)
    NombreGrafica VARCHAR(255) NOT NULL COMMENT 'Título/nombre de la gráfica',
    TipoGrafica ENUM('Linea','Barras','Pastel','Dona','Radar','Polar') NOT NULL COMMENT 'Tipo de gráfica según Chart.js',
    Parametros JSON DEFAULT NULL COMMENT 'Parámetros básicos de configuración (showLegend, responsive, etc.)',
    
    -- Nuevos campos del sistema mejorado
    Color VARCHAR(7) DEFAULT '#A61930' COMMENT 'Color hexadecimal principal de la gráfica',
    TractorSeleccionado VARCHAR(100) DEFAULT NULL COMMENT 'ID o nombre del tractor específico (NULL = todos)',
    TipoOrigen ENUM('columna', 'formula') DEFAULT 'columna' COMMENT 'Origen de los datos: columna directa o fórmula',
    
    -- Información detallada de origen de datos (JSON)
    ColumnaOrigen JSON DEFAULT NULL COMMENT 'Info de columna: {nombre, hoja, indiceColumna}',
    FormulaAplicada JSON DEFAULT NULL COMMENT 'Info de fórmula: {nombre, estructuraFormula, resultados}',
    Filtros JSON DEFAULT NULL COMMENT 'Filtros aplicados: [{parametro, columna, indice}]',
    ParametrosFormula JSON DEFAULT NULL COMMENT 'Parámetros de fórmula: [{letra, columnaAsignada, posicion, estaAsignado}]',
    
    -- Configuración avanzada y metadatos
    ConfiguracionAvanzada JSON DEFAULT NULL COMMENT 'Config avanzada: {estadoGrafica, tieneDatos, chartConfig, etc.}',
    
    -- Campos de auditoría
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaModificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UsuarioCreacion VARCHAR(100) DEFAULT NULL COMMENT 'Usuario que creó la gráfica',
    
    FOREIGN KEY (IdContenido) REFERENCES contenido(IdContenido) ON DELETE CASCADE,
    INDEX idx_contenido_grafica (IdContenido),
    INDEX idx_nombre_grafica (NombreGrafica),
    INDEX idx_tipo_grafica (TipoGrafica),
    INDEX idx_tractor_seleccionado (TractorSeleccionado),
    INDEX idx_tipo_origen (TipoOrigen),
    INDEX idx_fecha_creacion_grafica (FechaCreacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Gráficas con información completa del sistema mejorado - incluye fórmulas, filtros y configuración avanzada';

-- ==================================================
-- TABLA DE TEXTOS
-- ==================================================

CREATE TABLE IF NOT EXISTS texto (
    IdTexto INT AUTO_INCREMENT PRIMARY KEY,
    IdContenido INT NOT NULL,
    TipoTexto ENUM('titulo', 'subtitulo', 'parrafo', 'encabezado', 'pie') NOT NULL COMMENT 'Tipo de elemento de texto',
    Alineacion ENUM('left', 'center', 'right', 'justify') DEFAULT 'left' COMMENT 'Alineación del texto',
    ContenidoTexto TEXT NOT NULL COMMENT 'Contenido real del texto',
    EstilosAdicionales JSON DEFAULT NULL COMMENT 'Estilos CSS adicionales: {fontSize, fontWeight, color, etc.}',
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (IdContenido) REFERENCES contenido(IdContenido) ON DELETE CASCADE,
    INDEX idx_contenido_texto (IdContenido),
    INDEX idx_tipo_texto (TipoTexto),
    FULLTEXT idx_contenido_busqueda (ContenidoTexto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Elementos de texto en las plantillas';

-- ==================================================
-- TABLA DE FÓRMULAS DE PLANTILLAS
-- ==================================================

CREATE TABLE IF NOT EXISTS formulasplantilla (
    IdFormula INT AUTO_INCREMENT PRIMARY KEY,
    IdGrafica INT NOT NULL,
    NombreFormula VARCHAR(255) NOT NULL COMMENT 'Nombre descriptivo de la fórmula (ej: Promedio_Rendimiento_Mensual)',
    EstructuraFormula TEXT NOT NULL COMMENT 'Estructura completa de la fórmula (ej: =PROMEDIO(A:A))',
    TipoFormula ENUM('PROMEDIO', 'SUMA', 'CONTAR', 'MAX', 'MIN', 'PERSONALIZADA') DEFAULT 'PERSONALIZADA',
    
    -- Parámetros y configuración de la fórmula
    Parametros JSON DEFAULT NULL COMMENT 'Parámetros detallados: [{letra, columnaAsignada, estaAsignado, tipoParametro}]',
    ResultadosEjemplo JSON DEFAULT NULL COMMENT 'Ejemplos de resultados de la fórmula: [valor1, valor2, ...]',
    RangoDatos VARCHAR(100) DEFAULT NULL COMMENT 'Rango de datos de origen (ej: A1:A100)',
    
    -- Metadatos de aplicación
    ConfiguracionAplicacion JSON DEFAULT NULL COMMENT 'Config específica: {frecuenciaCalculo, validaciones, etc.}',
    
    -- Estado y auditoría
    EstadoFormula ENUM('activa', 'inactiva', 'error', 'pendiente') DEFAULT 'activa',
    MensajeError TEXT DEFAULT NULL COMMENT 'Mensaje de error si la fórmula falló',
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaModificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FechaUltimaEjecucion TIMESTAMP NULL DEFAULT NULL,
    
    FOREIGN KEY (IdGrafica) REFERENCES grafica(IdGrafica) ON DELETE CASCADE,
    INDEX idx_grafica_formula (IdGrafica),
    INDEX idx_nombre_formula (NombreFormula),
    INDEX idx_tipo_formula (TipoFormula),
    INDEX idx_estado_formula (EstadoFormula),
    INDEX idx_fecha_ultima_ejecucion (FechaUltimaEjecucion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Fórmulas específicas asociadas a gráficas con trazabilidad completa';

-- ==================================================
-- TABLA DE METADATOS DE PLANTILLAS
-- ==================================================

CREATE TABLE IF NOT EXISTS plantillametadatos (
    IdMetadato INT AUTO_INCREMENT PRIMARY KEY,
    IdPlantilla INT NOT NULL,
    
    -- Información contextual capturada
    TractoresUtilizados JSON DEFAULT NULL COMMENT 'Lista de tractores referenciados: ["Tractor_001", "Tractor_002"]',
    HojasUtilizadas JSON DEFAULT NULL COMMENT 'Hojas de datos utilizadas: ["DatosRendimiento", "DatosRegionales"]',
    FormulasResumen JSON DEFAULT NULL COMMENT 'Resumen de fórmulas: {tipos, cantidades, nombres}',
    
    -- Estadísticas de creación
    EstadisticasCreacion JSON DEFAULT NULL COMMENT 'Estadísticas al crear: {totalElementos, graficasConDatos, etc.}',
    ParametrosGlobales JSON DEFAULT NULL COMMENT 'Parámetros globales utilizados en la plantilla',
    
    -- Información de compatibilidad
    HojasRequeridas JSON DEFAULT NULL COMMENT 'Hojas requeridas para funcionar: ["Hoja1", "Hoja2"]',
    ColumnasRequeridas JSON DEFAULT NULL COMMENT 'Columnas específicas requeridas por hoja',
    VersionCompatibilidad VARCHAR(10) DEFAULT '2.0' COMMENT 'Versión mínima compatible',
    
    -- Metadatos del sistema
    VersionPlantilla VARCHAR(10) DEFAULT '2.0' COMMENT 'Versión del sistema cuando se creó',
    EntornoCreacion ENUM('desarrollo', 'pruebas', 'produccion') DEFAULT 'produccion',
    
    -- Estadísticas de uso
    VecesAplicada INT DEFAULT 0 COMMENT 'Cuántas veces se ha aplicado la plantilla',
    FechaUltimaAplicacion TIMESTAMP NULL DEFAULT NULL,
    UsuariosQueAplicaron JSON DEFAULT NULL COMMENT 'Usuarios que han aplicado la plantilla',
    
    -- Auditoría
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaModificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (IdPlantilla) REFERENCES plantilla(idPlantilla) ON DELETE CASCADE,
    INDEX idx_plantilla_metadatos (IdPlantilla),
    INDEX idx_version_plantilla (VersionPlantilla),
    INDEX idx_fecha_ultima_aplicacion (FechaUltimaAplicacion),
    INDEX idx_entorno_creacion (EntornoCreacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Metadatos extendidos para plantillas del sistema mejorado - trazabilidad y compatibilidad';

-- ==================================================
-- TABLA DE HISTORIAL DE APLICACIONES
-- ==================================================

CREATE TABLE IF NOT EXISTS historial_aplicaciones (
    IdAplicacion INT AUTO_INCREMENT PRIMARY KEY,
    IdPlantilla INT NOT NULL,
    
    -- Información de la aplicación
    UsuarioAplicacion VARCHAR(100) NOT NULL COMMENT 'Usuario que aplicó la plantilla',
    FechaAplicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ResultadoAplicacion ENUM('exitosa', 'con_advertencias', 'fallida') NOT NULL,
    
    -- Detalles de compatibilidad
    CompatibilidadDatos JSON DEFAULT NULL COMMENT 'Resultado de validación de compatibilidad',
    DatosUtilizados JSON DEFAULT NULL COMMENT 'Estructura de datos que se utilizó',
    ElementosAplicados INT DEFAULT 0 COMMENT 'Número de elementos aplicados exitosamente',
    ElementosFallidos INT DEFAULT 0 COMMENT 'Número de elementos que fallaron',
    
    -- Advertencias y errores
    Advertencias JSON DEFAULT NULL COMMENT 'Lista de advertencias generadas',
    Errores JSON DEFAULT NULL COMMENT 'Lista de errores encontrados',
    
    -- Metadatos de la aplicación
    TiempoEjecucion INT DEFAULT NULL COMMENT 'Tiempo de ejecución en milisegundos',
    EntornoAplicacion VARCHAR(50) DEFAULT NULL COMMENT 'Entorno donde se aplicó',
    VersionSistemaAplicacion VARCHAR(10) DEFAULT NULL COMMENT 'Versión del sistema al aplicar',
    
    FOREIGN KEY (IdPlantilla) REFERENCES plantilla(idPlantilla) ON DELETE CASCADE,
    INDEX idx_plantilla_historial (IdPlantilla),
    INDEX idx_usuario_aplicacion (UsuarioAplicacion),
    INDEX idx_fecha_aplicacion (FechaAplicacion),
    INDEX idx_resultado_aplicacion (ResultadoAplicacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Historial completo de aplicaciones de plantillas con métricas y trazabilidad';

-- ==================================================
-- VISTAS ÚTILES PARA EL SISTEMA
-- ==================================================

-- Vista para obtener plantillas con estadísticas básicas
CREATE OR REPLACE VIEW vista_plantillas_resumen AS
SELECT 
    p.idPlantilla,
    p.NombrePlantilla,
    p.EstadoPlantilla,
    p.FechaCreacion,
    pr.idPlantillaReporte,
    pr.Nombre as NombreReporte,
    pr.Descripcion,
    -- Contar elementos
    COUNT(DISTINCT c.IdContenido) as TotalElementos,
    COUNT(DISTINCT g.IdGrafica) as TotalGraficas,
    COUNT(DISTINCT t.IdTexto) as TotalTextos,
    COUNT(DISTINCT f.IdFormula) as TotalFormulas,
    -- Metadatos básicos
    pm.VecesAplicada,
    pm.FechaUltimaAplicacion,
    pm.VersionPlantilla
FROM plantilla p
LEFT JOIN plantillareporte pr ON p.idPlantilla = pr.IdPlantilla
LEFT JOIN contenido c ON p.idPlantilla = c.IdPlantilla AND c.EstadoContenido = 'activo'
LEFT JOIN grafica g ON c.IdContenido = g.IdContenido
LEFT JOIN texto t ON c.IdContenido = t.IdContenido
LEFT JOIN formulasplantilla f ON g.IdGrafica = f.IdGrafica AND f.EstadoFormula = 'activa'
LEFT JOIN plantillametadatos pm ON p.idPlantilla = pm.IdPlantilla
WHERE p.EstadoPlantilla = 'activa'
GROUP BY p.idPlantilla, pr.idPlantillaReporte
ORDER BY p.FechaCreacion DESC;

-- Vista para gráficas con información completa
CREATE OR REPLACE VIEW vista_graficas_completas AS
SELECT 
    g.IdGrafica,
    g.NombreGrafica,
    g.TipoGrafica,
    g.Color,
    g.TractorSeleccionado,
    g.TipoOrigen,
    c.IdPlantilla,
    c.OrdenContenido,
    p.NombrePlantilla,
    -- Información de fórmulas asociadas
    COUNT(f.IdFormula) as TotalFormulas,
    GROUP_CONCAT(f.NombreFormula SEPARATOR ', ') as NombresFormulas,
    -- Metadatos JSON parseados
    JSON_UNQUOTE(JSON_EXTRACT(g.ColumnaOrigen, '$.nombre')) as NombreColumna,
    JSON_UNQUOTE(JSON_EXTRACT(g.ColumnaOrigen, '$.hoja')) as HojaOrigen,
    JSON_UNQUOTE(JSON_EXTRACT(g.FormulaAplicada, '$.nombre')) as NombreFormulaPrincipal,
    JSON_UNQUOTE(JSON_EXTRACT(g.ConfiguracionAvanzada, '$.estadoGrafica')) as EstadoGrafica
FROM grafica g
JOIN contenido c ON g.IdContenido = c.IdContenido
JOIN plantilla p ON c.IdPlantilla = p.idPlantilla
LEFT JOIN formulasplantilla f ON g.IdGrafica = f.IdGrafica AND f.EstadoFormula = 'activa'
WHERE c.EstadoContenido = 'activo' AND p.EstadoPlantilla = 'activa'
GROUP BY g.IdGrafica
ORDER BY c.IdPlantilla, c.OrdenContenido;

-- ==================================================
-- DATOS DE EJEMPLO BASADOS EN TU ESTRUCTURA
-- ==================================================

-- Insertar plantilla de ejemplo
INSERT IGNORE INTO plantilla (
    idPlantilla, NombrePlantilla, FrecuenciaEnvio, CorreoDestino, VersionSistema
) VALUES (
    1, 'Reporte Completo Tractores Q4 2024', 168, 'gerencia@tractech.com', '2.0'
);

-- Insertar reporte de ejemplo
INSERT IGNORE INTO plantillareporte (
    idPlantillaReporte, IdPlantilla, Nombre, Descripcion, FrecuenciaEnvio, CorreoDestino
) VALUES (
    456, 1, 'Reporte Completo Tractores Q4 2024', 'Análisis trimestral con fórmulas avanzadas', 168, 'gerencia@tractech.com'
);

-- Insertar contenidos de ejemplo
INSERT IGNORE INTO contenido (IdContenido, IdPlantilla, OrdenContenido, TipoContenido) VALUES
(1, 1, 1, 'Grafica'),
(2, 1, 2, 'Texto'),
(3, 1, 3, 'Grafica');

-- Insertar gráfica de ejemplo con fórmula
INSERT IGNORE INTO grafica (
    IdGrafica, IdContenido, NombreGrafica, TipoGrafica, Color, TractorSeleccionado, TipoOrigen,
    Parametros, ColumnaOrigen, FormulaAplicada, Filtros, ParametrosFormula, ConfiguracionAvanzada
) VALUES (
    1, 1, 'Rendimiento Promedio Mensual', 'Barras', '#A61930', 'Tractor_001', 'formula',
    '{"showLegend": true, "responsive": true}',
    '{"nombre": "Rendimiento_Total", "hoja": "DatosRendimiento", "indiceColumna": 2}',
    '{"nombre": "Promedio_Rendimiento_Mensual", "estructuraFormula": "=PROMEDIO(A:A)", "resultados": [85.2, 87.1, 89.3, 86.7]}',
    '[{"parametro": "A", "columna": "Fecha", "indice": 0}, {"parametro": "B", "columna": "TipoTractor", "indice": 1}]',
    '[{"letra": "A", "columnaAsignada": "RendimientoDiario", "posicion": 0, "estaAsignado": true}]',
    '{"estadoGrafica": "activa", "tieneDatos": true, "colorPersonalizado": "#A61930", "tractorEspecifico": "Tractor_001", "chartConfig": {"labels": ["Enero", "Febrero", "Marzo", "Abril"], "datasetLabel": "Rendimiento (%)", "tituloActual": "Rendimiento Promedio por Mes"}}'
);

-- Insertar texto de ejemplo
INSERT IGNORE INTO texto (
    IdTexto, IdContenido, TipoTexto, Alineacion, ContenidoTexto
) VALUES (
    1, 2, 'titulo', 'center', 'Análisis de Rendimiento Q4 2024'
);

-- Insertar segunda gráfica de ejemplo
INSERT IGNORE INTO grafica (
    IdGrafica, IdContenido, NombreGrafica, TipoGrafica, Color, TipoOrigen,
    ColumnaOrigen, Filtros, ConfiguracionAvanzada
) VALUES (
    2, 3, 'Distribución por Región', 'Pastel', '#2E7D32', 'columna',
    '{"nombre": "Region", "hoja": "DatosRegionales", "indiceColumna": 0}',
    '[{"parametro": "A", "columna": "Estado", "indice": 1}]',
    '{"estadoGrafica": "activa", "tieneDatos": true, "chartConfig": {"showPercentages": true, "explodeSlice": 0}}'
);

-- Insertar fórmula de ejemplo
INSERT IGNORE INTO formulasplantilla (
    IdFormula, IdGrafica, NombreFormula, EstructuraFormula, TipoFormula,
    Parametros, ResultadosEjemplo, EstadoFormula
) VALUES (
    1, 1, 'Promedio_Rendimiento_Mensual', '=PROMEDIO(A:A)', 'PROMEDIO',
    '[{"letra": "A", "columnaAsignada": "RendimientoDiario", "estaAsignado": true}]',
    '[85.2, 87.1, 89.3, 86.7]',
    'activa'
);

-- Insertar metadatos de ejemplo
INSERT IGNORE INTO plantillametadatos (
    IdPlantilla, TractoresUtilizados, HojasUtilizadas, FormulasResumen,
    EstadisticasCreacion, HojasRequeridas, VersionPlantilla
) VALUES (
    1,
    '["Tractor_001"]',
    '["DatosRendimiento", "DatosRegionales"]',
    '{"tiposFormula": ["Promedio_Rendimiento_Mensual"], "totalFormulas": 1}',
    '{"totalElementos": 3, "graficasConDatos": 2, "formulasAplicadas": 1, "textosVacios": 0}',
    '["DatosRendimiento", "DatosRegionales"]',
    '2.0'
);

-- ==================================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- ==================================================

-- Índices compuestos para consultas frecuentes
CREATE INDEX idx_plantilla_activa_fecha ON plantilla(EstadoPlantilla, FechaCreacion);
CREATE INDEX idx_contenido_plantilla_orden ON contenido(IdPlantilla, OrdenContenido, TipoContenido);
CREATE INDEX idx_grafica_tractor_tipo ON grafica(TractorSeleccionado, TipoOrigen, TipoGrafica);
CREATE INDEX idx_formula_estado_nombre ON formulasplantilla(EstadoFormula, NombreFormula);

-- Índices para campos JSON (MySQL 5.7+)
-- ALTER TABLE grafica ADD INDEX idx_columna_nombre ((JSON_UNQUOTE(JSON_EXTRACT(ColumnaOrigen, '$.nombre'))));
-- ALTER TABLE grafica ADD INDEX idx_formula_nombre ((JSON_UNQUOTE(JSON_EXTRACT(FormulaAplicada, '$.nombre'))));

-- ==================================================
-- PROCEDIMIENTOS ALMACENADOS ÚTILES
-- ==================================================

DELIMITER //

-- Procedimiento para obtener estadísticas de una plantilla
CREATE PROCEDURE IF NOT EXISTS ObtenerEstadisticasPlantilla(IN p_idPlantilla INT)
BEGIN
    SELECT 
        p.NombrePlantilla,
        COUNT(DISTINCT c.IdContenido) as TotalElementos,
        COUNT(DISTINCT CASE WHEN c.TipoContenido = 'Grafica' THEN c.IdContenido END) as TotalGraficas,
        COUNT(DISTINCT CASE WHEN c.TipoContenido = 'Texto' THEN c.IdContenido END) as TotalTextos,
        COUNT(DISTINCT f.IdFormula) as TotalFormulas,
        COUNT(DISTINCT CASE WHEN g.TractorSeleccionado IS NOT NULL THEN g.IdGrafica END) as GraficasConTractor,
        pm.VecesAplicada,
        pm.FechaUltimaAplicacion
    FROM plantilla p
    LEFT JOIN contenido c ON p.idPlantilla = c.IdPlantilla AND c.EstadoContenido = 'activo'
    LEFT JOIN grafica g ON c.IdContenido = g.IdContenido
    LEFT JOIN formulasplantilla f ON g.IdGrafica = f.IdGrafica AND f.EstadoFormula = 'activa'
    LEFT JOIN plantillametadatos pm ON p.idPlantilla = pm.IdPlantilla
    WHERE p.idPlantilla = p_idPlantilla AND p.EstadoPlantilla = 'activa'
    GROUP BY p.idPlantilla;
END //

-- Función para validar compatibilidad de hojas
CREATE FUNCTION IF NOT EXISTS ValidarCompatibilidadHojas(
    p_idPlantilla INT,
    p_hojasDisponibles JSON
) RETURNS JSON
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_hojasRequeridas JSON;
    DECLARE v_resultado JSON;
    
    -- Obtener hojas requeridas de metadatos
    SELECT HojasRequeridas INTO v_hojasRequeridas
    FROM plantillametadatos 
    WHERE IdPlantilla = p_idPlantilla;
    
    -- Si no hay metadatos, extraer de las gráficas
    IF v_hojasRequeridas IS NULL THEN
        SELECT JSON_ARRAYAGG(DISTINCT JSON_UNQUOTE(JSON_EXTRACT(g.ColumnaOrigen, '$.hoja')))
        INTO v_hojasRequeridas
        FROM grafica g
        JOIN contenido c ON g.IdContenido = c.IdContenido
        WHERE c.IdPlantilla = p_idPlantilla 
        AND JSON_EXTRACT(g.ColumnaOrigen, '$.hoja') IS NOT NULL;
    END IF;
    
    -- Construir resultado de compatibilidad
    SET v_resultado = JSON_OBJECT(
        'hojasRequeridas', v_hojasRequeridas,
        'hojasDisponibles', p_hojasDisponibles,
        'fechaValidacion', NOW()
    );
    
    RETURN v_resultado;
END //

DELIMITER ;

-- ==================================================
-- TRIGGERS PARA AUDITORÍA Y MANTENIMIENTO
-- ==================================================

DELIMITER //

-- Trigger para actualizar metadatos cuando se modifica una plantilla
CREATE TRIGGER IF NOT EXISTS tr_actualizar_metadatos_plantilla
AFTER UPDATE ON plantilla
FOR EACH ROW
BEGIN
    IF NEW.EstadoPlantilla != OLD.EstadoPlantilla THEN
        UPDATE plantillametadatos 
        SET FechaModificacion = NOW()
        WHERE IdPlantilla = NEW.idPlantilla;
    END IF;
END //

-- Trigger para incrementar contador de aplicaciones
CREATE TRIGGER IF NOT EXISTS tr_incrementar_aplicaciones
AFTER INSERT ON historial_aplicaciones
FOR EACH ROW
BEGIN
    IF NEW.ResultadoAplicacion = 'exitosa' THEN
        UPDATE plantillametadatos 
        SET VecesAplicada = VecesAplicada + 1,
            FechaUltimaAplicacion = NEW.FechaAplicacion
        WHERE IdPlantilla = NEW.IdPlantilla;
    END IF;
END //

DELIMITER ;

-- ==================================================
-- VERIFICACIÓN FINAL DEL SCRIPT
-- ==================================================

-- Mostrar resumen de tablas creadas
SELECT 
    TABLE_NAME as 'Tabla Creada',
    TABLE_COMMENT as 'Descripción',
    TABLE_ROWS as 'Filas'
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME IN ('plantilla', 'plantillareporte', 'contenido', 'grafica', 'texto', 'formulasplantilla', 'plantillametadatos', 'historial_aplicaciones')
ORDER BY TABLE_NAME;

-- Mostrar estadísticas de datos de ejemplo insertados
SELECT 'Datos de ejemplo insertados correctamente' as Estado,
       (SELECT COUNT(*) FROM plantilla) as Plantillas,
       (SELECT COUNT(*) FROM contenido) as Contenidos,
       (SELECT COUNT(*) FROM grafica) as Graficas,
       (SELECT COUNT(*) FROM formulasplantilla) as Formulas;

-- Mensaje final
SELECT '✅ Base de datos del Sistema de Plantillas Mejorado creada exitosamente' as Resultado,
       'Versión 2.0 - Compatible con frontend TracTech' as Version,
       NOW() as FechaCreacion;
