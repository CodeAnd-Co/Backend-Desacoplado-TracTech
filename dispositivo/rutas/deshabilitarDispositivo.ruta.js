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
 *     summary: Deshabilitar un dispositivo
 *     description: Deshabilita un dispositivo específico para que no pueda acceder al sistema.
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
 *                 description: ID único del dispositivo a deshabilitar
 *                 example: "abc123def456ghi789"
 *                 minLength: 10
 *
 *     responses:
 *       200:
 *         description: Dispositivo deshabilitado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Dispositivo deshabilitado exitosamente"
 *                 exito:
 *                   type: boolean
 *                   example: true
 *                 dispositivo:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "abc123def456ghi789"
 *                     activo:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "El ID del dispositivo es requerido"
 *                 exito:
 *                   type: boolean
 *                   example: false
 *       401:
 *         description: Token de autenticación inválido
 *       403:
 *         description: Sin permisos para realizar esta acción
 *       404:
 *         description: Dispositivo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Dispositivo no encontrado"
 *                 exito:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Error interno del servidor
 */
ruteador.post('/', verificarToken, verificarPermisos, deshabilitarDispositivoControlador.deshabilitarDispositivo);

module.exports = ruteador;
