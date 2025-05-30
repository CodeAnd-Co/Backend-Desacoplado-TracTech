// dispositivo/rutas/verificarEstadoDispositivo.ruta.js

const express = require('express');
const verificarEstadoControlador = require('../controladores/verificarEstadoDispositivo.controlador');
const verificarToken = require('../../util/middlewares/middlewareAutenticacion');

const ruteador = express.Router();

/**
 * @swagger
 * /dispositivo/estado:
 *   post:
 *     summary: Verificar estado de un dispositivo
 *     description: Verifica si un dispositivo está activo o deshabilitado en el sistema.
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
 *                 example: "abc123def456ghi789"
 *                 minLength: 10
 *     responses:
 *       200:
 *         description: Estado del dispositivo verificado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Dispositivo activo"
 *                 activo:
 *                   type: boolean
 *                   example: true
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
 *                 activo:
 *                   type: boolean
 *                   example: false
 *       401:
 *         description: Token de autenticación inválido
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Error interno del servidor"
 *                 activo:
 *                   type: boolean
 *                   example: false
 */
ruteador.post('/', verificarToken, verificarEstadoControlador.verificarEstado);

module.exports = ruteador;