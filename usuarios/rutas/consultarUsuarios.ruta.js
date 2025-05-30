// RF40 Administrador consulta usuarios - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF40

const express = require('express');
const ruteador = express.Router();
const verificarToken = require('../../util/middlewares/middlewareAutenticacion');

const { consultarUsuarios: consultarUsuariosControlador } = require('../controladores/consultarUsuarios.controlador');
const { verificarPermisos, checarPermisos } = require('../../util/middlewares/middlewarePermisos');

/**
 * @swagger
 * /usuarios/consultarUsuarios:
 *   get:
 *     summary: Consultar todos los usuarios
 *     description: Permite que un administrador consulte la lista completa de usuarios registrados en el sistema.
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuarios consultados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'Consulta de usuarios exitosa'
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       idUsuario:
 *                         type: integer
 *                         description: ID único del usuario
 *                         example: 1
 *                       Nombre:
 *                         type: string
 *                         description: Nombre completo del usuario
 *                         example: 'Juan Carlos Pérez'
 *                       Correo:
 *                         type: string
 *                         format: email
 *                         description: Correo electrónico del usuario
 *                         example: 'juan.perez@example.com'
 *                       Rol:
 *                         type: integer
 *                         description: ID del rol asignado al usuario
 *                         example: 2
 *       401:
 *         description: Token de autenticación inválido o faltante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'Token no válido'
 *       403:
 *         description: Permisos insuficientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'No tienes permisos para realizar esta acción'
 *       404:
 *         description: No se encontraron usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'No se encontraron usuarios'
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
ruteador.get(
  '/',
  verificarToken,
  verificarPermisos,
  checarPermisos('ADMIN'),
  consultarUsuariosControlador
);

module.exports = ruteador;
