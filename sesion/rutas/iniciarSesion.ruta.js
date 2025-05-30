// RF2 Usuario registrado inicia sesión - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF2

const express = require('express');
const iniciarSesionControlador = require('../controladores/iniciarSesion.controlador');

const ruteador = express.Router();

/**
 * @swagger
 * /sesion/iniciarSesion:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     description: Permite que un usuario registrado inicie sesión en el sistema proporcionando sus credenciales.
 *     tags:
 *       - Sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - contrasenia
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *                 example: 'usuario@example.com'
 *               contrasenia:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: 'miContrasena123'
 *                 minLength: 1
 *     responses:
 *       200:
 *         description: Usuario inició sesión exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'Usuario inició sesión con éxito'
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
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
 *                     - 'Faltan datos requeridos'
 *                     - 'Correo inválido'
 *                   examples:
 *                     missing_data:
 *                       value: 'Faltan datos requeridos'
 *                     invalid_email:
 *                       value: 'Correo inválido'
 *       401:
 *         description: Credenciales incorrectas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'Usuario o contraseña incorrectos'
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
    iniciarSesionControlador.iniciarSesion
);

module.exports = ruteador;
