// dispositivo/rutas/listarDispositivos.ruta.js

const express = require('express');
const listarDispositivosControlador = require('../controladores/listarDispositivos.controlador');
const verificarToken = require('../../util/middlewares/middlewareAutenticacion');
const { verificarPermisos } = require('../../util/middlewares/middlewarePermisos');

const ruteador = express.Router();

/**
 * @swagger
 * /dispositivo/listar:
 *   get:
 *     summary: Listar todos los dispositivos
 *     description: Obtiene una lista de todos los dispositivos registrados en el sistema.
 *     tags:
 *       - Dispositivos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de dispositivos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'Dispositivos obtenidos exitosamente'
 *                 total:
 *                   type: number
 *                   example: 5
 *                 dispositivos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 'abc123def456ghi789'
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
 *                         nullable: true
 *                       metadata:
 *                         type: object
 *                         nullable: true
 *       401:
 *         description: Token de autenticación inválido
 *       403:
 *         description: Sin permisos para realizar esta acción
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'Error interno del servidor'
 *                 dispositivos:
 *                   type: array
 *                   example: []
 */
ruteador.get('/', verificarToken, verificarPermisos, listarDispositivosControlador.listarDispositivos);

module.exports = ruteador;
