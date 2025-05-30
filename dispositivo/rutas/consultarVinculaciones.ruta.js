// dispositivo/rutas/consultarVinculaciones.ruta.js

const express = require('express');
const { consultarVinculaciones, consultarDispositivosDeUsuario } = require('../controladores/consultarVinculacionDispositivos.controlador');
const verificarToken = require('../../util/middlewares/middlewareAutenticacion');
const { verificarPermisos } = require('../../util/middlewares/middlewarePermisos');

const ruteador = express.Router();

/**
 * @swagger
 * /dispositivo/vinculaciones:
 *   get:
 *     summary: Consultar todas las vinculaciones dispositivo-usuario
 *     description: Obtiene una lista de todos los dispositivos y sus vinculaciones con usuarios.
 *     tags:
 *       - Dispositivos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vinculaciones obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Vinculaciones obtenidas exitosamente"
 *                 total:
 *                   type: number
 *                   example: 10
 *                 vinculaciones:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       dispositivo:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "abc123def456ghi789"
 *                           estado:
 *                             type: boolean
 *                             example: true
 *                           fechaRegistro:
 *                             type: string
 *                             format: date-time
 *                           fechaUltimaActividad:
 *                             type: string
 *                             format: date-time
 *                           fechaVinculacion:
 *                             type: string
 *                             format: date-time
 *                       usuario:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id:
 *                             type: number
 *                             example: 1
 *                           nombre:
 *                             type: string
 *                             example: "Juan Pérez"
 *                           correo:
 *                             type: string
 *                             example: "juan@example.com"
 *                       estaVinculado:
 *                         type: boolean
 *                         example: true
 *       401:
 *         description: Token de autenticación inválido
 *       403:
 *         description: Sin permisos para realizar esta acción
 *       500:
 *         description: Error interno del servidor
 */
ruteador.get('/', verificarToken, verificarPermisos, consultarVinculaciones);

/**
 * @swagger
 * /dispositivo/vinculaciones/usuario/{idUsuario}:
 *   get:
 *     summary: Consultar dispositivos de un usuario específico
 *     description: Obtiene todos los dispositivos vinculados a un usuario específico.
 *     tags:
 *       - Dispositivos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *         example: 1
 *     responses:
 *       200:
 *         description: Dispositivos del usuario obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Dispositivos del usuario obtenidos exitosamente"
 *                 idUsuario:
 *                   type: number
 *                   example: 1
 *                 total:
 *                   type: number
 *                   example: 3
 *                 dispositivos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "abc123def456ghi789"
 *                       estado:
 *                         type: boolean
 *                         example: true
 *                       fechaRegistro:
 *                         type: string
 *                         format: date-time
 *                       fechaUltimaActividad:
 *                         type: string
 *                         format: date-time
 *                       fechaVinculacion:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: ID de usuario inválido
 *       401:
 *         description: Token de autenticación inválido
 *       403:
 *         description: Sin permisos para realizar esta acción
 *       500:
 *         description: Error interno del servidor
 */
ruteador.get('/usuario/:idUsuario', verificarToken, verificarPermisos, consultarDispositivosDeUsuario);

module.exports = ruteador;