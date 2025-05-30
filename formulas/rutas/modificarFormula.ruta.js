// RF68 - Modificar fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF68 

const express = require('express');
const ruteador = express.Router();
const verificarToken = require('../../util/middlewares/middlewareAutenticacion');

const modificarFormulaControlador = require('../controladores/modificarFormulaControlador');
const { verificarPermisos, checarPermisos } = require('../../util/middlewares/middlewarePermisos');

/**
 * @swagger
 * /formulas/modificarFormula:
 *   put:
 *     summary: Modificar una fórmula
 *     description: Permite modificar una fórmula existente.
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
 *               - id
 *               - nombre
 *               - formula
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID de la fórmula a modificar
 *                 example: 1
 *               nombre:
 *                 type: string
 *                 description: Nuevo nombre de la fórmula
 *                 example: 'Fórmula de rendimiento v2'
 *               formula:
 *                 type: string
 *                 description: Nueva fórmula
 *                 example: '(velocidad * tiempo) / area'
 *     responses:
 *       200:
 *         description: Fórmula modificada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'Fórmula modificada con éxito'
 *       400:
 *         description: Datos inválidos o faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'Faltan datos requeridos'
 *       404:
 *         description: Fórmula no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'No se encontró la fórmula o no se realizaron cambios'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'Error interno del servidor, intente más tarde'
 */
ruteador.put(
    '/',
    verificarToken,
    verificarPermisos,
    checarPermisos('PUEDECREAR'),
    modificarFormulaControlador.modificarFormula,
);

module.exports = ruteador;