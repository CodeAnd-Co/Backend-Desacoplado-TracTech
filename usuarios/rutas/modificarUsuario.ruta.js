// RF41 Administrador modifica usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF41

const express = require('express');
const ruteador = express.Router();
const verificarToken = require('../../util/middlewares/middlewareAutenticacion');

const { modificarUsuario: modificarUsuarioControlador } = require('../controladores/modificarUsuario.controlador');
const { verificarPermisos, checarPermisos } = require('../../util/middlewares/middlewarePermisos');

/**
 * @swagger
 * /usuarios/modificarUsuario:
 *   put:
 *     summary: Modificar un usuario
 *     description: Permite que un administrador modifique los datos de un usuario existente.
 *     tags:
 *       - Usuarios
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
 *                 description: ID del usuario a modificar
 *                 example: 1
 *                 minimum: 1
 *               nombre:
 *                 type: string
 *                 description: Nuevo nombre del usuario (opcional)
 *                 example: "Juan Carlos Pérez"
 *                 maxLength: 100
 *               correo:
 *                 type: string
 *                 format: email
 *                 description: Nuevo correo del usuario (opcional)
 *                 example: "juan.perez@example.com"
 *                 maxLength: 100
 *               contrasenia:
 *                 type: string
 *                 description: Nueva contraseña del usuario (opcional)
 *                 example: "nuevaContrasena123"
 *                 minLength: 1
 *               idRol:
 *                 type: integer
 *                 description: Nuevo ID del rol del usuario (opcional)
 *                 example: 2
 *                 minimum: 1
 *                 maximum: 3
 *     responses:
 *       200:
 *         description: Usuario modificado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Usuario modificado exitosamente"
 *       400:
 *         description: Datos inválidos o faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   enum:
 *                     - "No se recibieron datos para modificar el usuario"
 *                     - "El ID del usuario es requerido"
 *                     - "El ID del usuario no es válido"
 *                     - "No se proporcionaron campos para actualizar"
 *                     - "El correo ya está en uso"
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
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "El usuario no existe"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Error al modificar el usuario"
 */
ruteador.put(
  '/',
  verificarToken,
  verificarPermisos,
  checarPermisos('ADMIN'),
  modificarUsuarioControlador
);

module.exports = ruteador;
