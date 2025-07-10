# Sistema de Plantillas Simplificado - TracTech

## Descripción General

El nuevo sistema de plantillas simplificado reemplaza la estructura compleja anterior con un enfoque más directo y fácil de mantener. Cada plantilla se almacena como un objeto simple con tres campos principales:

- **idPlantilla**: Identificador único auto-generado
- **nombre**: Nombre descriptivo de la plantilla
- **json**: Estructura completa de la plantilla en formato JSON

## Ventajas del Sistema Simplificado

### 1. **Simplicidad**
- Una sola tabla en la base de datos
- Estructura de datos unificada
- Fácil migración y backup

### 2. **Flexibilidad**
- Cualquier estructura puede almacenarse en el campo JSON
- No hay limitaciones de esquema rígido
- Evolución fácil de la estructura

### 3. **Rendimiento**
- Menos consultas a la base de datos
- Operaciones CRUD más rápidas
- Menos complejidad en las transacciones

### 4. **Mantenimiento**
- Código más limpio y fácil de entender
- Menos archivos de configuración
- Debugging simplificado

## Estructura de la Base de Datos

```sql
CREATE TABLE plantilla_simplificada (
    idPlantilla INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    json LONGTEXT NOT NULL,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Estructura del JSON de Plantilla

### Ejemplo Básico
```json
{
  "datos": [
    {
      "tipo": "grafica",
      "id": "grafica1",
      "configuracion": {
        "tipo": "line",
        "titulo": "Ventas por Mes",
        "color": "#3498db",
        "eje_x": "fecha",
        "eje_y": "ventas"
      }
    },
    {
      "tipo": "texto",
      "id": "texto1",
      "contenido": "Reporte de ventas del mes actual",
      "estilo": {
        "fontSize": "16px",
        "fontWeight": "bold"
      }
    }
  ],
  "configuracion": {
    "titulo": "Reporte de Ventas",
    "descripcion": "Análisis mensual de ventas",
    "layout": "vertical",
    "responsive": true
  },
  "metadatos": {
    "version": "1.0",
    "autor": "Sistema TracTech",
    "tags": ["ventas", "mensual", "reporte"]
  }
}
```

### Ejemplo Avanzado con Fórmulas
```json
{
  "datos": [
    {
      "tipo": "grafica",
      "id": "grafica_eficiencia",
      "configuracion": {
        "tipo": "bar",
        "titulo": "Eficiencia por Tractor",
        "formula": {
          "id": "formula_eficiencia",
          "nombre": "Cálculo de Eficiencia",
          "expresion": "(combustible_consumido / horas_trabajo) * factor_eficiencia",
          "parametros": {
            "factor_eficiencia": 0.85
          }
        }
      }
    }
  ],
  "configuracion": {
    "titulo": "Dashboard de Eficiencia",
    "filtros": {
      "fecha_inicio": "2024-01-01",
      "fecha_fin": "2024-12-31",
      "tractores": ["tractor_001", "tractor_002"]
    }
  }
}
```

## API Endpoints

### 1. Guardar Plantilla
```http
POST /api/plantillas/simplificadas
Content-Type: application/json

{
  "nombre": "Mi Plantilla",
  "json": { /* estructura de la plantilla */ }
}
```

**Respuesta:**
```json
{
  "exito": true,
  "mensaje": "Plantilla guardada exitosamente",
  "datos": {
    "idPlantilla": 123,
    "nombre": "Mi Plantilla",
    "estadisticas": {
      "tamanoBytes": 1024,
      "elementosEnDatos": 3,
      "tiposElementos": {"grafica": 2, "texto": 1}
    }
  }
}
```

### 2. Obtener Todas las Plantillas
```http
GET /api/plantillas/simplificadas
```

### 3. Obtener Plantilla por ID
```http
GET /api/plantillas/simplificadas/123
```

### 4. Actualizar Plantilla
```http
PUT /api/plantillas/simplificadas/123
Content-Type: application/json

{
  "nombre": "Nuevo Nombre",
  "json": { /* nueva estructura */ }
}
```

### 5. Eliminar Plantilla
```http
DELETE /api/plantillas/simplificadas/123
```

### 6. Buscar Plantillas
```http
GET /api/plantillas/simplificadas/buscar?termino=ventas
```

### 7. Duplicar Plantilla
```http
POST /api/plantillas/simplificadas/123/duplicar
Content-Type: application/json

{
  "nuevoNombre": "Copia de Mi Plantilla"
}
```

### 8. Validar Estructura
```http
POST /api/plantillas/simplificadas/validar
Content-Type: application/json

{
  "json": { /* estructura a validar */ }
}
```

## Migración desde el Sistema Anterior

### Script de Migración
```javascript
// Ejemplo de migración de datos existentes
async function migrarPlantillasAnteriores() {
  const plantillasAnteriores = await obtenerPlantillasAnteriores();
  
  for (const plantilla of plantillasAnteriores) {
    const jsonSimplificado = {
      datos: plantilla.elementos,
      configuracion: {
        titulo: plantilla.nombre,
        frecuenciaEnvio: plantilla.frecuenciaEnvio,
        correoDestino: plantilla.correoDestino
      },
      metadatos: {
        version: "1.0",
        migradoDesde: "sistema_anterior",
        fechaMigracion: new Date().toISOString()
      }
    };
    
    await guardarPlantillaSimplificada({
      nombre: plantilla.nombre,
      json: jsonSimplificado
    });
  }
}
```

## Validaciones

### Estructura Básica
- El campo `json` debe ser un objeto válido
- Debe contener al menos el campo `datos` como array
- Cada elemento en `datos` debe tener `tipo` e `id`

### Validaciones Automáticas
- Tamaño máximo del JSON
- Estructura de elementos requeridos
- Tipos de datos válidos
- Caracteres especiales en nombres

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| `NOMBRE_REQUERIDO` | El nombre de la plantilla es obligatorio |
| `JSON_REQUERIDO` | La estructura JSON es obligatoria |
| `ESTRUCTURA_INVALIDA` | La estructura JSON no es válida |
| `ID_INVALIDO` | El ID proporcionado no es válido |
| `PLANTILLA_NO_ENCONTRADA` | La plantilla solicitada no existe |
| `ERROR_GUARDADO` | Error al guardar en la base de datos |
| `ERROR_INTERNO` | Error interno del servidor |

## Mejores Prácticas

### 1. Nomenclatura
- Usar nombres descriptivos para las plantillas
- Incluir versión en metadatos
- Usar IDs únicos para elementos

### 2. Estructura del JSON
- Mantener la estructura organizada
- Usar configuración separada de datos
- Incluir metadatos para trazabilidad

### 3. Rendimiento
- Evitar JSONs excesivamente grandes
- Usar índices apropiados en búsquedas
- Implementar paginación para listas grandes

### 4. Seguridad
- Validar entrada antes de guardar
- Sanitizar datos JSON
- Implementar controles de acceso

## Ejemplo de Uso en Frontend

```javascript
// Guardar plantilla
const nuevaPlantilla = {
  nombre: "Dashboard Operativo",
  json: {
    datos: [
      {
        tipo: "grafica",
        id: "eficiencia_combustible",
        configuracion: {
          tipo: "line",
          titulo: "Eficiencia de Combustible",
          datos_origen: "sensor_combustible"
        }
      }
    ],
    configuracion: {
      titulo: "Dashboard Operativo",
      actualizacion_automatica: true,
      intervalo_actualizacion: 30000
    }
  }
};

const respuesta = await fetch('/api/plantillas/simplificadas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(nuevaPlantilla)
});

const resultado = await respuesta.json();
console.log('Plantilla guardada:', resultado);
```

## Conclusión

El sistema de plantillas simplificado ofrece una solución más elegante y mantenible para gestionar plantillas de reportes. Su estructura simple pero flexible permite evolucionar fácilmente según las necesidades futuras del sistema TracTech.
