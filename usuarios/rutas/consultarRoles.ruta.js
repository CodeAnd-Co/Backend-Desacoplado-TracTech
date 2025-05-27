// RF39: Administrador crea usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF39

const express = require('express');
const ruteador = express.Router();
const verificarToken = require('../../util/middlewares/middlewareAutenticacion');

const consultarRolesControlador = require('../controladores/consultarRoles.controlador');
const { verificarPermisos, checarPermisos } = require('../../util/middlewares/middlewarePermisos');

/**
 * @swagger
 * /usuarios/consultarRolesUsuarios:
 *   get:
 *     summary: Consultar roles de usuarios
 *     description: Permite que un administrador consulte todos los roles disponibles para asignar a usuarios (excluyendo el rol de administrador).
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Roles consultados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Consulta de roles exitosa"
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       idRol:
 *                         type: integer
 *                         description: ID único del rol
 *                         example: 2
 *                       Nombre:
 *                         type: string
 *                         description: Nombre del rol
 *                         example: "Operador"
 *       401:
 *         description: Token de autenticación inválido o faltante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Token no válido"
 *       403:
 *         description: Permisos insuficientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "No tienes permisos para realizar esta acción"
 *       404:
 *         description: No se encontraron roles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "No se encontraron roles"
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
 */
ruteador.get(
  '/',
  verificarToken,
  verificarPermisos,
  checarPermisos('ADMIN'),
  consultarRolesControlador.consultarRoles
);

module.exports = ruteador;