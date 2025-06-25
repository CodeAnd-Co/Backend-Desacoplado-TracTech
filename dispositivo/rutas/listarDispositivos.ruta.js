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
 *                       metadata:
 *                         type: object
 *                         nullable: true
 *                       idUsuario:
 *                         type: number
 *                         nullable: true
 *                         example: 123
 *                       nombreUsuario:
 *                         type: string
 *                         nullable: true
 *                         example: 'Juan Pérez'
 *       401:
 *         description: Token de autenticación inválido
 *       403:
 *         description: Sin permisos para realizar esta acción
 *       503:
 *         description: Servicio temporalmente no disponible - Problemas de conexión a la base de datos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'Servicio temporalmente no disponible. Verifique su conexión a internet e intente nuevamente.'
 *                 dispositivos:
 *                   type: array
 *                   example: []
 *                 error:
 *                   type: string
 *                   example: 'CONEXION_BD_FALLIDA'
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
 *                 error:
 *                   type: string
 *                   example: 'ERROR_INTERNO'
 */
ruteador.get('/', verificarToken, verificarPermisos, listarDispositivosControlador.listarDispositivos);

module.exports = ruteador;
