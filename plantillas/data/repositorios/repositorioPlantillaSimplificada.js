//RF34 Usuario guarda plantilla de reporte - Repositorio Simplificado

const PlantillaSimplificada = require('../modelos/modeloPlantillaSimplificada.js');

/**
 * Repositorio para plantillas simplificadas
 * Maneja todas las operaciones de datos para el modelo simplificado
 */
class RepositorioPlantillaSimplificada {

  /**
   * Guarda una nueva plantilla simplificada
   * @param {Object} datosPlantilla - Datos de la plantilla
   * @param {string} datosPlantilla.nombre - Nombre de la plantilla
   * @param {Object} datosPlantilla.json - Estructura completa de la plantilla
   * @returns {Promise<Object>} Resultado con ID y estadísticas
   */
  static async guardarPlantilla(datosPlantilla) {
    try {
      const { nombre, json } = datosPlantilla;

      // Validar datos requeridos
      if (!nombre || !nombre.trim()) {
        throw new Error('El nombre de la plantilla es requerido');
      }

      if (!json) {
        throw new Error('La estructura JSON de la plantilla es requerida');
      }

      // Insertar plantilla
      const idPlantilla = await PlantillaSimplificada.insertarPlantilla({
        nombre: nombre.trim(),
        json
      });

      // Calcular estadísticas básicas
      const estadisticas = this.calcularEstadisticasJson(json);

      return {
        exito: true,
        idPlantilla,
        mensaje: 'Plantilla guardada exitosamente',
        estadisticas: {
          ...estadisticas,
          fechaCreacion: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        exito: false,
        mensaje: `Error al guardar la plantilla: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Obtiene una plantilla por su ID
   * @param {number} idPlantilla - ID de la plantilla
   * @returns {Promise<Object>}
   */
  static async obtenerPlantillaPorId(idPlantilla) {
    try {
      const plantilla = await PlantillaSimplificada.obtenerPorId(idPlantilla);
      
      if (!plantilla) {
        return {
          exito: false,
          mensaje: 'Plantilla no encontrada'
        };
      }

      return {
        exito: true,
        plantilla: plantilla.toObject(),
        estadisticas: this.calcularEstadisticasJson(plantilla.json)
      };

    } catch (error) {
      return {
        exito: false,
        mensaje: `Error al obtener la plantilla: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Obtiene todas las plantillas
   * @returns {Promise<Object>}
   */
  static async obtenerTodasLasPlantillas() {
    try {
      const plantillas = await PlantillaSimplificada.obtenerTodas();
      
      return {
        exito: true,
        plantillas: plantillas.map(p => p.toObject()),
        total: plantillas.length,
        estadisticasGenerales: await PlantillaSimplificada.obtenerEstadisticas()
      };

    } catch (error) {
      return {
        exito: false,
        mensaje: `Error al obtener las plantillas: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Actualiza una plantilla existente
   * @param {number} idPlantilla - ID de la plantilla
   * @param {Object} nuevosdatos - Nuevos datos de la plantilla
   * @returns {Promise<Object>}
   */
  static async actualizarPlantilla(idPlantilla, nuevosData) {
    try {
      const { nombre, json } = nuevosData;

      if (!nombre || !nombre.trim()) {
        throw new Error('El nombre de la plantilla es requerido');
      }

      if (!json) {
        throw new Error('La estructura JSON de la plantilla es requerida');
      }

      const actualizada = await PlantillaSimplificada.actualizar(idPlantilla, {
        nombre: nombre.trim(),
        json
      });

      if (!actualizada) {
        return {
          exito: false,
          mensaje: 'Plantilla no encontrada o no se pudo actualizar'
        };
      }

      return {
        exito: true,
        mensaje: 'Plantilla actualizada exitosamente',
        estadisticas: this.calcularEstadisticasJson(json)
      };

    } catch (error) {
      return {
        exito: false,
        mensaje: `Error al actualizar la plantilla: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Elimina una plantilla
   * @param {number} idPlantilla - ID de la plantilla
   * @returns {Promise<Object>}
   */
  static async eliminarPlantilla(idPlantilla) {
    try {
      const eliminada = await PlantillaSimplificada.eliminar(idPlantilla);

      if (!eliminada) {
        return {
          exito: false,
          mensaje: 'Plantilla no encontrada'
        };
      }

      return {
        exito: true,
        mensaje: 'Plantilla eliminada exitosamente'
      };

    } catch (error) {
      return {
        exito: false,
        mensaje: `Error al eliminar la plantilla: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Busca plantillas por nombre
   * @param {string} termino - Término de búsqueda
   * @returns {Promise<Object>}
   */
  static async buscarPlantillas(termino) {
    try {
      const plantillas = await PlantillaSimplificada.buscarPorNombre(termino);
      
      return {
        exito: true,
        plantillas: plantillas.map(p => p.toObject()),
        total: plantillas.length,
        terminoBusqueda: termino
      };

    } catch (error) {
      return {
        exito: false,
        mensaje: `Error al buscar plantillas: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Duplica una plantilla existente
   * @param {number} idPlantillaOriginal - ID de la plantilla a duplicar
   * @param {string} nuevoNombre - Nombre para la plantilla duplicada
   * @returns {Promise<Object>}
   */
  static async duplicarPlantilla(idPlantillaOriginal, nuevoNombre) {
    try {
      const plantillaOriginal = await PlantillaSimplificada.obtenerPorId(idPlantillaOriginal);
      
      if (!plantillaOriginal) {
        return {
          exito: false,
          mensaje: 'Plantilla original no encontrada'
        };
      }

      // Crear nueva plantilla con el mismo JSON pero diferente nombre
      return await this.guardarPlantilla({
        nombre: nuevoNombre,
        json: plantillaOriginal.json
      });

    } catch (error) {
      return {
        exito: false,
        mensaje: `Error al duplicar la plantilla: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Calcula estadísticas básicas del JSON de una plantilla
   * @param {Object} json - Estructura JSON de la plantilla
   * @returns {Object} Estadísticas calculadas
   */
  static calcularEstadisticasJson(json) {
    try {
      const estadisticas = {
        tamanoBytes: JSON.stringify(json).length,
        elementosEnDatos: 0,
        tiposElementos: {},
        tieneDatos: false,
        tieneConfiguracion: false
      };

      // Analizar la estructura del JSON
      if (json.datos && Array.isArray(json.datos)) {
        estadisticas.tieneDatos = true;
        estadisticas.elementosEnDatos = json.datos.length;

        // Contar tipos de elementos
        json.datos.forEach(elemento => {
          if (elemento.tipo) {
            estadisticas.tiposElementos[elemento.tipo] = 
              (estadisticas.tiposElementos[elemento.tipo] || 0) + 1;
          }
        });
      }

      // Verificar si tiene configuración adicional
      const claves = Object.keys(json);
      estadisticas.tieneConfiguracion = claves.some(clave => 
        !['datos', 'nombre'].includes(clave)
      );

      return estadisticas;

    } catch (error) {
      return {
        tamanoBytes: 0,
        elementosEnDatos: 0,
        tiposElementos: {},
        tieneDatos: false,
        tieneConfiguracion: false,
        error: error.message
      };
    }
  }

  /**
   * Valida la estructura básica de una plantilla
   * @param {Object} json - Estructura JSON a validar
   * @returns {Object} Resultado de validación
   */
  static validarEstructuraPlantilla(json) {
    const errores = [];
    const advertencias = [];

    try {
      // Validaciones básicas
      if (!json || typeof json !== 'object') {
        errores.push('La plantilla debe ser un objeto JSON válido');
        return { valida: false, errores, advertencias };
      }

      // Verificar si tiene datos
      if (!json.datos) {
        advertencias.push('La plantilla no contiene datos');
      } else if (!Array.isArray(json.datos)) {
        errores.push('El campo "datos" debe ser un array');
      } else if (json.datos.length === 0) {
        advertencias.push('El array de datos está vacío');
      }

      // Validar elementos en datos
      if (json.datos && Array.isArray(json.datos)) {
        json.datos.forEach((elemento, index) => {
          if (!elemento.tipo) {
            errores.push(`Elemento en posición ${index} no tiene tipo definido`);
          }
          if (!elemento.id) {
            advertencias.push(`Elemento en posición ${index} no tiene ID definido`);
          }
        });
      }

      return {
        valida: errores.length === 0,
        errores,
        advertencias,
        estadisticas: this.calcularEstadisticasJson(json)
      };

    } catch (error) {
      return {
        valida: false,
        errores: [`Error al validar estructura: ${error.message}`],
        advertencias
      };
    }
  }
}

module.exports = RepositorioPlantillaSimplificada;
