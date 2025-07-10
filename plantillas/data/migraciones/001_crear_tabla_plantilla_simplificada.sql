-- Migración para sistema de plantillas simplificado
-- Crea la tabla plantilla_simplificada con estructura: idPlantilla, nombre, json

-- Crear la tabla plantilla_simplificada
CREATE TABLE IF NOT EXISTS plantilla_simplificada (
    idPlantilla INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    json LONGTEXT NOT NULL,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre),
    INDEX idx_fecha_creacion (fechaCreacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comentarios para documentar la tabla
ALTER TABLE plantilla_simplificada 
COMMENT = 'Tabla simplificada para almacenar plantillas de reporte como JSON completo';

-- Añadir comentarios a las columnas
ALTER TABLE plantilla_simplificada 
MODIFY COLUMN idPlantilla INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único de la plantilla',
MODIFY COLUMN nombre VARCHAR(255) NOT NULL COMMENT 'Nombre descriptivo de la plantilla',
MODIFY COLUMN json LONGTEXT NOT NULL COMMENT 'Estructura completa de la plantilla en formato JSON',
MODIFY COLUMN fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación de la plantilla',
MODIFY COLUMN fechaModificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última modificación';

-- Crear índices adicionales para mejorar rendimiento
CREATE INDEX idx_nombre_texto ON plantilla_simplificada(nombre(50));
CREATE INDEX idx_fechas ON plantilla_simplificada(fechaCreacion, fechaModificacion);

-- Insertar datos de ejemplo (opcional)
INSERT INTO plantilla_simplificada (nombre, json) VALUES
('Plantilla de Ejemplo - Reporte Básico', '{"datos": [{"tipo": "grafica", "id": "grafica1", "configuracion": {"tipo": "line", "titulo": "Gráfica de Ejemplo"}}, {"tipo": "texto", "id": "texto1", "contenido": "Texto de ejemplo"}], "configuracion": {"titulo": "Reporte Básico", "descripcion": "Plantilla de ejemplo para mostrar la estructura básica"}}'),
('Plantilla Dashboard', '{"datos": [{"tipo": "grafica", "id": "dashboard1", "configuracion": {"tipo": "bar", "titulo": "Dashboard Principal"}}, {"tipo": "grafica", "id": "dashboard2", "configuracion": {"tipo": "pie", "titulo": "Distribución de Datos"}}], "configuracion": {"titulo": "Dashboard Completo", "layout": "grid", "responsive": true}}');

-- Verificar que la tabla se creó correctamente
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'plantilla_simplificada' 
ORDER BY ORDINAL_POSITION;
