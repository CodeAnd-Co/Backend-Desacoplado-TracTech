// RF71 - Eliminar una fórmula - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF71

const express = require('express');
const ruteador = express.Router();
const verificarToken = require('../../util/middlewares/middlewareAutenticacion');

const eliminarFormulaControlador = require('../controladores/eliminarFormulaControlador');
const { verificarPermisos, checarPermisos } = require('../../util/middlewares/middlewarePermisos');


/**
 * @swagger
 * /formulas/eliminarFormula:
 *   delete:
 *     summary: Eliminar una fórmula
 *     description: Permite eliminar una fórmula existente de la base de datos.
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
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID de la fórmula a eliminar
 *                 example: 1
 *     responses:
 *       200:
 *         description: Fórmula eliminada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Fórmula eliminada con éxito"
 *       400:
 *         description: ID de la fórmula inválido o faltante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "El id de la fórmula es requerido"
 *       404:
 *         description: Fórmula no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "No se encontró la fórmula o no se realizaron cambios"
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
ruteador.delete(
    '/', 
    verificarToken,
    verificarPermisos,
    checarPermisos('PUEDEELIMINAR'),
    eliminarFormulaControlador.eliminarFormula
);

module.exports = ruteador;