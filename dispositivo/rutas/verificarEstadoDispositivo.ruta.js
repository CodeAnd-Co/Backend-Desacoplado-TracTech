// dispositivo/rutas/verificarEstadoDispositivo.ruta.js

const express = require('express');
const verificarEstadoControlador = require('../controladores/verificarEstadoDispositivo.controlador');
const verificarToken = require('../../util/middlewares/middlewareAutenticacion');

const ruteador = express.Router();

/**
 * @swagger
 * /dispositivo/estado:
 *   post:
 *     summary: Verificar el estado de un dispositivo
 *     description: Verifica si un dispositivo está activo y lo registra/vincula automáticamente si es necesario.
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
 *         description: Estado del dispositivo obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'Dispositivo activo'
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 vinculado:
 *                   type: boolean
 *                   example: true
 *                 idUsuario:
 *                   type: number
 *                   nullable: true
 *                   example: 1
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: Token de autenticación inválido
 *       500:
 *         description: Error interno del servidor
 */
ruteador.post('/', verificarToken, verificarEstadoControlador.verificarEstado);

module.exports = ruteador;
