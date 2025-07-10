//RF34 Usuario guarda plantilla de reporte - Controlador Simplificado

const RepositorioPlantillaSimplificada = require('../data/repositorios/repositorioPlantillaSimplificada.js');

/**
 * Controlador simplificado para manejo de plantillas
 * Estructura: { idPlantilla, nombre, json }
 */
class ControladorPlantillaSimplificada {

  /**
   * Guarda una nueva plantilla simplificada
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  static async guardarPlantilla(req, res) {
    try {
      const { nombre, json } = req.body;

      // Validar datos de entrada
      if (!nombre || !nombre.trim()) {
        return res.status(400).json({
          exito: false,
          mensaje: 'El nombre de la plantilla es requerido',
          codigo: 'NOMBRE_REQUERIDO'
        });
      }

      if (!json) {
        return res.status(400).json({
          exito: false,
          mensaje: 'La estructura JSON de la plantilla es requerida',
          codigo: 'JSON_REQUERIDO'
        });
      }

      // Validar estructura de la plantilla
      const validacion = RepositorioPlantillaSimplificada.validarEstructuraPlantilla(json);
      
      if (!validacion.valida) {
        return res.status(400).json({
          exito: false,
          mensaje: 'La estructura de la plantilla no es válida',
          errores: validacion.errores,
          advertencias: validacion.advertencias,
          codigo: 'ESTRUCTURA_INVALIDA'
        });
      }

      // Guardar plantilla
      const resultado = await RepositorioPlantillaSimplificada.guardarPlantilla({
        nombre: nombre.trim(),
        json
      });

      if (!resultado.exito) {
        return res.status(500).json({
          exito: false,
          mensaje: resultado.mensaje,
          error: resultado.error,
          codigo: 'ERROR_GUARDADO'
        });
      }

      // Respuesta exitosa
      res.status(201).json({
        exito: true,
        mensaje: 'Plantilla guardada exitosamente',
        datos: {
          idPlantilla: resultado.idPlantilla,
          nombre: nombre.trim(),
          estadisticas: resultado.estadisticas,
          validacion: {
            errores: validacion.errores,
            advertencias: validacion.advertencias
          }
        }
      });

    } catch (error) {
      console.error('Error en guardarPlantilla:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error interno del servidor al guardar la plantilla',
        error: error.message,
        codigo: 'ERROR_INTERNO'
      });
    }
  }

  /**
   * Obtiene una plantilla por su ID
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  static async obtenerPlantilla(req, res) {
    try {
      const { idPlantilla } = req.params;

      if (!idPlantilla || isNaN(idPlantilla)) {
        return res.status(400).json({
          exito: false,
          mensaje: 'ID de plantilla inválido',
          codigo: 'ID_INVALIDO'
        });
      }

      const resultado = await RepositorioPlantillaSimplificada.obtenerPlantillaPorId(parseInt(idPlantilla));

      if (!resultado.exito) {
        return res.status(404).json({
          exito: false,
          mensaje: resultado.mensaje,
          codigo: 'PLANTILLA_NO_ENCONTRADA'
        });
      }

      res.json({
        exito: true,
        mensaje: 'Plantilla obtenida exitosamente',
        datos: resultado.plantilla,
        estadisticas: resultado.estadisticas
      });

    } catch (error) {
      console.error('Error en obtenerPlantilla:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error interno del servidor al obtener la plantilla',
        error: error.message,
        codigo: 'ERROR_INTERNO'
      });
    }
  }

  /**
   * Obtiene todas las plantillas
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  static async obtenerTodasLasPlantillas(req, res) {
    try {
      const resultado = await RepositorioPlantillaSimplificada.obtenerTodasLasPlantillas();

      if (!resultado.exito) {
        return res.status(500).json({
          exito: false,
          mensaje: resultado.mensaje,
          error: resultado.error,
          codigo: 'ERROR_OBTENCION'
        });
      }

      res.json({
        exito: true,
        mensaje: `Se encontraron ${resultado.total} plantillas`,
        datos: resultado.plantillas,
        total: resultado.total,
        estadisticasGenerales: resultado.estadisticasGenerales
      });

    } catch (error) {
      console.error('Error en obtenerTodasLasPlantillas:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error interno del servidor al obtener las plantillas',
        error: error.message,
        codigo: 'ERROR_INTERNO'
      });
    }
  }

  /**
   * Actualiza una plantilla existente
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  static async actualizarPlantilla(req, res) {
    try {
      const { idPlantilla } = req.params;
      const { nombre, json } = req.body;

      if (!idPlantilla || isNaN(idPlantilla)) {
        return res.status(400).json({
          exito: false,
          mensaje: 'ID de plantilla inválido',
          codigo: 'ID_INVALIDO'
        });
      }

      if (!nombre || !nombre.trim()) {
        return res.status(400).json({
          exito: false,
          mensaje: 'El nombre de la plantilla es requerido',
          codigo: 'NOMBRE_REQUERIDO'
        });
      }

      if (!json) {
        return res.status(400).json({
          exito: false,
          mensaje: 'La estructura JSON de la plantilla es requerida',
          codigo: 'JSON_REQUERIDO'
        });
      }

      // Validar estructura
      const validacion = RepositorioPlantillaSimplificada.validarEstructuraPlantilla(json);
      
      if (!validacion.valida) {
        return res.status(400).json({
          exito: false,
          mensaje: 'La estructura de la plantilla no es válida',
          errores: validacion.errores,
          advertencias: validacion.advertencias,
          codigo: 'ESTRUCTURA_INVALIDA'
        });
      }

      const resultado = await RepositorioPlantillaSimplificada.actualizarPlantilla(parseInt(idPlantilla), {
        nombre: nombre.trim(),
        json
      });

      if (!resultado.exito) {
        return res.status(404).json({
          exito: false,
          mensaje: resultado.mensaje,
          codigo: 'PLANTILLA_NO_ENCONTRADA'
        });
      }

      res.json({
        exito: true,
        mensaje: 'Plantilla actualizada exitosamente',
        datos: {
          idPlantilla: parseInt(idPlantilla),
          nombre: nombre.trim(),
          estadisticas: resultado.estadisticas,
          validacion: {
            errores: validacion.errores,
            advertencias: validacion.advertencias
          }
        }
      });

    } catch (error) {
      console.error('Error en actualizarPlantilla:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error interno del servidor al actualizar la plantilla',
        error: error.message,
        codigo: 'ERROR_INTERNO'
      });
    }
  }

  /**
   * Elimina una plantilla
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  static async eliminarPlantilla(req, res) {
    try {
      const { idPlantilla } = req.params;

      if (!idPlantilla || isNaN(idPlantilla)) {
        return res.status(400).json({
          exito: false,
          mensaje: 'ID de plantilla inválido',
          codigo: 'ID_INVALIDO'
        });
      }

      const resultado = await RepositorioPlantillaSimplificada.eliminarPlantilla(parseInt(idPlantilla));

      if (!resultado.exito) {
        return res.status(404).json({
          exito: false,
          mensaje: resultado.mensaje,
          codigo: 'PLANTILLA_NO_ENCONTRADA'
        });
      }

      res.json({
        exito: true,
        mensaje: 'Plantilla eliminada exitosamente',
        datos: {
          idPlantilla: parseInt(idPlantilla)
        }
      });

    } catch (error) {
      console.error('Error en eliminarPlantilla:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error interno del servidor al eliminar la plantilla',
        error: error.message,
        codigo: 'ERROR_INTERNO'
      });
    }
  }

  /**
   * Busca plantillas por nombre
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  static async buscarPlantillas(req, res) {
    try {
      const { termino } = req.query;

      if (!termino || !termino.trim()) {
        return res.status(400).json({
          exito: false,
          mensaje: 'Término de búsqueda requerido',
          codigo: 'TERMINO_REQUERIDO'
        });
      }

      const resultado = await RepositorioPlantillaSimplificada.buscarPlantillas(termino.trim());

      if (!resultado.exito) {
        return res.status(500).json({
          exito: false,
          mensaje: resultado.mensaje,
          error: resultado.error,
          codigo: 'ERROR_BUSQUEDA'
        });
      }

      res.json({
        exito: true,
        mensaje: `Se encontraron ${resultado.total} plantillas`,
        datos: resultado.plantillas,
        total: resultado.total,
        terminoBusqueda: resultado.terminoBusqueda
      });

    } catch (error) {
      console.error('Error en buscarPlantillas:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error interno del servidor al buscar plantillas',
        error: error.message,
        codigo: 'ERROR_INTERNO'
      });
    }
  }

  /**
   * Duplica una plantilla existente
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  static async duplicarPlantilla(req, res) {
    try {
      const { idPlantilla } = req.params;
      const { nuevoNombre } = req.body;

      if (!idPlantilla || isNaN(idPlantilla)) {
        return res.status(400).json({
          exito: false,
          mensaje: 'ID de plantilla inválido',
          codigo: 'ID_INVALIDO'
        });
      }

      if (!nuevoNombre || !nuevoNombre.trim()) {
        return res.status(400).json({
          exito: false,
          mensaje: 'El nuevo nombre para la plantilla es requerido',
          codigo: 'NOMBRE_REQUERIDO'
        });
      }

      const resultado = await RepositorioPlantillaSimplificada.duplicarPlantilla(
        parseInt(idPlantilla),
        nuevoNombre.trim()
      );

      if (!resultado.exito) {
        return res.status(404).json({
          exito: false,
          mensaje: resultado.mensaje,
          codigo: 'PLANTILLA_NO_ENCONTRADA'
        });
      }

      res.status(201).json({
        exito: true,
        mensaje: 'Plantilla duplicada exitosamente',
        datos: {
          idPlantillaOriginal: parseInt(idPlantilla),
          idPlantillaNueva: resultado.idPlantilla,
          nuevoNombre: nuevoNombre.trim(),
          estadisticas: resultado.estadisticas
        }
      });

    } catch (error) {
      console.error('Error en duplicarPlantilla:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error interno del servidor al duplicar la plantilla',
        error: error.message,
        codigo: 'ERROR_INTERNO'
      });
    }
  }

  /**
   * Valida la estructura de una plantilla sin guardarla
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  static async validarEstructura(req, res) {
    try {
      const { json } = req.body;

      if (!json) {
        return res.status(400).json({
          exito: false,
          mensaje: 'La estructura JSON de la plantilla es requerida',
          codigo: 'JSON_REQUERIDO'
        });
      }

      const validacion = RepositorioPlantillaSimplificada.validarEstructuraPlantilla(json);

      res.json({
        exito: true,
        mensaje: validacion.valida ? 'Estructura válida' : 'Estructura inválida',
        datos: {
          valida: validacion.valida,
          errores: validacion.errores,
          advertencias: validacion.advertencias,
          estadisticas: validacion.estadisticas
        }
      });

    } catch (error) {
      console.error('Error en validarEstructura:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error interno del servidor al validar la estructura',
        error: error.message,
        codigo: 'ERROR_INTERNO'
      });
    }
  }
}

module.exports = ControladorPlantillaSimplificada;
