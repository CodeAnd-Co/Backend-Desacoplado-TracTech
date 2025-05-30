// dispositivo/rutas/deshabilitarDispositivo.ruta.js

const express = require('express');
const deshabilitarDispositivoControlador = require('../controladores/deshabilitarDispositivo.controlador');
const verificarToken = require('../../util/middlewares/middlewareAutenticacion');
const { verificarPermisos } = require('../../util/middlewares/middlewarePermisos');

const ruteador = express.Router();

/**
 * @swagger
 * /dispositivo/deshabilitar:
 *   post:
 *     summary: Deshabilitar dispositivo de un usuario
 *     description: Deshabilita el dispositivo vinculado a un usuario específico en el sistema y lo desvincula para permitir su reasignación.
 *     tags:
 *       - Dispositivos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idUsuario
 *             properties:
 *               idUsuario:
 *                 type: integer
 *                 description: ID único del usuario cuyo dispositivo se desea deshabilitar
 *                 example: 123
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Dispositivo deshabilitado y desvinculado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: Token de autenticación inválido
 *       403:
 *         description: Sin permisos para realizar esta acción
 *       404:
 *         description: Usuario no encontrado o no tiene dispositivo vinculado
 *       500:
 *         description: Error interno del servidor
 */
ruteador.post('/', verificarToken, verificarPermisos, deshabilitarDispositivoControlador.deshabilitarDispositivo);

module.exports = ruteador;