// RF39: Administrador crea usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF39

const express = require('express');
const ruteador = express.Router();
const verificarToken = require('../../util/middlewares/middlewareAutenticacion');

const crearUsuarioControlador = require('../controladores/crearUsuario.controlador');
const { verificarPermisos, checarPermisos } = require('../../util/middlewares/middlewarePermisos');

/**
 * @swagger
 * /usuarios/crearUsuario:
 *   post:
 *     summary: Crear un nuevo usuario
 *     description: Permite que un administrador cree un nuevo usuario en el sistema.
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
 *               - nombre
 *               - correo
 *               - contrasenia
 *               - idRol
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre completo del usuario
 *                 example: 'Juan Carlos Pérez'
 *                 maxLength: 100
 *               correo:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico único del usuario
 *                 example: 'juan.perez@example.com'
 *                 maxLength: 100
 *               contrasenia:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: 'miContrasena123'
 *                 minLength: 1
 *               idRolFK:
 *                 type: integer
 *                 description: ID del rol del usuario (1-3)
 *                 example: 2
 *                 minimum: 1
 *                 maximum: 3
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'Usuario creado con éxito'
 *                 idUsuario:
 *                   type: integer
 *                   description: ID del usuario creado
 *                   example: 15
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
 *                     - 'Un campo requerido está vacío'
 *                     - 'El idRol no es un número'
 *                     - 'El idRol no es válido'
 *                     - 'El nombre no puede exceder los 100 caracteres'
 *                     - 'El correo no puede exceder los 100 caracteres'
 *                     - 'El correo ya está registrado'
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
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'Error de conexión, intente más tarde'
 */
ruteador.post(
  '/',
  verificarToken,
  verificarPermisos,
  checarPermisos('ADMIN'),
  crearUsuarioControlador.crearUsuarioControlador
);

module.exports = ruteador;
