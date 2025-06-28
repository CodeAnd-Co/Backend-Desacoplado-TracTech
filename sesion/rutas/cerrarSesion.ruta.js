// RF5 Usuario cierra sesión - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF5

const { Router } = require('express');
const verificarToken = require('../../util/middlewares/middlewareAutenticacion');

const cerrarSesionControlador = require('../controladores/cerrarSesion.controlador');

const ruteador = Router();

/**
 * @swagger
 * /sesion/cerrarSesion:
 *   post:
 *     summary: Cerrar sesión de usuario
 *     description: Permite que un usuario autenticado cierre su sesión invalidando el token JWT.
 *     tags:
 *       - Sesión
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'Sesión cerrada correctamente'
 *       400:
 *         description: Token no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'Token no proporcionado'
 *       401:
 *         description: Token de autenticación inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'Token no válido'
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
 */
ruteador.post(
    '/', 
    verificarToken, 
    cerrarSesionControlador.cerrarSesion
);

module.exports = ruteador;
