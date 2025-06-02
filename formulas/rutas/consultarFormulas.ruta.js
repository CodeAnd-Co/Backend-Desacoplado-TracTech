// RF76 - Consultar fórmulas - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF76

const express = require('express');
const ruteador = express.Router();
const verificarToken = require('../../util/middlewares/middlewareAutenticacion');

const consultarFormulasControlador = require('../controladores/consultarFormulaControlador');
const { verificarPermisos, checarPermisos } = require('../../util/middlewares/middlewarePermisos');

/**
 * @swagger
 * /formulas/consultarFormulas:
 *   get:
 *     summary: Consultar todas las fórmulas
 *     description: Obtiene una lista de todas las fórmulas almacenadas en la base de datos.
 *     tags:
 *       - Fórmulas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Fórmulas consultadas con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'Fórmulas consultadas con éxito'
 *                 datos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       idFormula:
 *                         type: integer
 *                         description: ID único de la fórmula
 *                         example: 1
 *                       Nombre:
 *                         type: string
 *                         description: Nombre de la fórmula
 *                         example: 'Fórmula de rendimiento'
 *                       Datos:
 *                         type: string
 *                         description: Expresión matemática de la fórmula
 *                         example: '=([@Velocidad] * [@Tiempo]) / [@Area'
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
 *         description: No se encontraron fórmulas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'Error al consultar las fórmulas: no se encontraron fórmulas'
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
ruteador.get('/', 
    verificarToken,
    verificarPermisos,
    checarPermisos('PUEDEVER'),
    consultarFormulasControlador.consultarFormula,);

module.exports = ruteador;
