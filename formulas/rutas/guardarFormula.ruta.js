// RF69 - Guardar fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF69

const express = require('express');
const ruteador = express.Router();
const verificarToken = require('../../util/middlewares/middlewareAutenticacion');

const guardarFormulaControlador = require('../controladores/guardarFormulaControlador');
const { verificarPermisos, checarPermisos } = require('../../util/middlewares/middlewarePermisos');

/**
 * @swagger
 * /formulas/guardarFormula:
 *   post:
 *     summary: Guardar una nueva fórmula
 *     description: Permite crear y guardar una nueva fórmula en la base de datos.
 *     tags:
 *       - Fórmulas
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
 *               - formula
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la fórmula
 *                 example: "Fórmula de rendimiento"
 *                 maxLength: 30
 *               formula:
 *                 type: string
 *                 description: Expresión matemática de la fórmula
 *                 example: "(velocidad * tiempo) / area"
 *                 maxLength: 512
 *     responses:
 *       200:
 *         description: Fórmula guardada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Fórmula guardada con éxito"
 *       400:
 *         description: Datos inválidos o faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   examples:
 *                     missing_data:
 *                       value: "Faltan datos requeridos"
 *                     name_too_long:
 *                       value: "El nombre no puede exceder los 30 caracteres"
 *                     formula_too_long:
 *                       value: "La fórmula no puede exceder los 512 caracteres"
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
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Error interno del servidor, intente más tarde"
 */
ruteador.post(
    '/',
    verificarToken,
    verificarPermisos,
    checarPermisos('PUEDECREAR'),
    guardarFormulaControlador.guardarFormula,
);

module.exports = ruteador;
