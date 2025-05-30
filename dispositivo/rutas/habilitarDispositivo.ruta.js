// dispositivo/rutas/habilitarDispositivo.ruta.js

const express = require('express');
const habilitarDispositivoControlador = require('../controladores/habilitarDispositivo.controlador');
const verificarToken = require('../../util/middlewares/middlewareAutenticacion');
const { verificarPermisos } = require('../../util/middlewares/middlewarePermisos');

const ruteador = express.Router();

/**
 * @swagger
 * /dispositivo/habilitar:
 *   post:
 *     summary: Habilitar un dispositivo
 *     description: Habilita un dispositivo en el sistema para que pueda ser utilizado.
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
 *               - dispositivoId
 *             properties:
 *               dispositivoId:
 *                 type: string
 *                 description: ID único del dispositivo
 *                 example: 'abc123def456ghi789'
 *                 minLength: 10
 *     responses:
 *       200:
 *         description: Dispositivo habilitado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: Token de autenticación inválido
 *       403:
 *         description: Sin permisos para realizar esta acción
 *       404:
 *         description: Dispositivo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
ruteador.post('/', verificarToken, verificarPermisos, habilitarDispositivoControlador.habilitarDispositivo);

module.exports = ruteador;
