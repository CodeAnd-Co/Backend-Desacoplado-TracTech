// RF43 Administrador elimina usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF43

const express = require('express');
const verificarToken = require('../../util/middlewares/middlewareAutenticacion');
const { verificarPermisos, checarPermisos } = require('../../util/middlewares/middlewarePermisos');
const eliminarUsuarioControlador = require('../controladores/eliminarUsuario.controlador');

const ruteador = express.Router();

/**
 * @swagger
 * /usuarios/eliminarUsuario/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     description: Permite que un administrador elimine un usuario del sistema usando su ID.
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a eliminar
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'Usuario eliminado exitosamente'
 *       400:
 *         description: ID del usuario inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'El ID del usuario debe ser un número'
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
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'El usuario no existe'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   examples:
 *                     no_id:
 *                       value: 'No se ha proporcionado el ID del usuario'
 *                     server_error:
 *                       value: 'Error interno del servidor'
 */
ruteador.delete(
  '/:id',
  verificarToken,
  verificarPermisos,
  checarPermisos('ADMIN'),
  eliminarUsuarioControlador.eliminarUsuario
);

module.exports = ruteador;
