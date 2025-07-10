//RF34 Usuario guarda plantilla de reporte - Rutas Simplificadas

const express = require('express');
const router = express.Router();
const ControladorPlantillaSimplificada = require('../controladores/controladorPlantillaSimplificada.js');

/**
 * Rutas para el sistema de plantillas simplificado
 * Estructura: { idPlantilla, nombre, json }
 */

/**
 * @route POST /api/plantillas-simplificadas
 * @desc Guarda una nueva plantilla simplificada
 * @body {string} nombre - Nombre de la plantilla
 * @body {Object} json - Estructura completa de la plantilla
 * @returns {Object} Respuesta con ID de la plantilla y estadísticas
 */
router.post('/', ControladorPlantillaSimplificada.guardarPlantilla);

/**
 * @route GET /api/plantillas-simplificadas
 * @desc Obtiene todas las plantillas simplificadas
 * @returns {Array} Lista de todas las plantillas
 */
router.get('/', ControladorPlantillaSimplificada.obtenerTodasLasPlantillas);

/**
 * @route GET /api/plantillas-simplificadas/buscar
 * @desc Busca plantillas por nombre
 * @query {string} termino - Término de búsqueda
 * @returns {Array} Lista de plantillas que coinciden con la búsqueda
 */
router.get('/buscar', ControladorPlantillaSimplificada.buscarPlantillas);

/**
 * @route POST /api/plantillas-simplificadas/validar
 * @desc Valida la estructura de una plantilla sin guardarla
 * @body {Object} json - Estructura JSON a validar
 * @returns {Object} Resultado de validación con errores y advertencias
 */
router.post('/validar', ControladorPlantillaSimplificada.validarEstructura);

/**
 * @route GET /api/plantillas-simplificadas/:idPlantilla
 * @desc Obtiene una plantilla específica por su ID
 * @param {number} idPlantilla - ID de la plantilla
 * @returns {Object} Datos de la plantilla y estadísticas
 */
router.get('/:idPlantilla', ControladorPlantillaSimplificada.obtenerPlantilla);

/**
 * @route PUT /api/plantillas-simplificadas/:idPlantilla
 * @desc Actualiza una plantilla existente
 * @param {number} idPlantilla - ID de la plantilla
 * @body {string} nombre - Nuevo nombre de la plantilla
 * @body {Object} json - Nueva estructura de la plantilla
 * @returns {Object} Respuesta de actualización con estadísticas
 */
router.put('/:idPlantilla', ControladorPlantillaSimplificada.actualizarPlantilla);

/**
 * @route DELETE /api/plantillas-simplificadas/:idPlantilla
 * @desc Elimina una plantilla
 * @param {number} idPlantilla - ID de la plantilla
 * @returns {Object} Confirmación de eliminación
 */
router.delete('/:idPlantilla', ControladorPlantillaSimplificada.eliminarPlantilla);

/**
 * @route POST /api/plantillas-simplificadas/:idPlantilla/duplicar
 * @desc Duplica una plantilla existente
 * @param {number} idPlantilla - ID de la plantilla a duplicar
 * @body {string} nuevoNombre - Nombre para la plantilla duplicada
 * @returns {Object} Datos de la nueva plantilla creada
 */
router.post('/:idPlantilla/duplicar', ControladorPlantillaSimplificada.duplicarPlantilla);

module.exports = router;
