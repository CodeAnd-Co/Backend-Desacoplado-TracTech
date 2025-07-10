//RF32 Usuario consulta plantillas de reporte. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF32
//RF33 Usuario elimina plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF33
//RF34 Usuario guarda plantilla de reporte. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF34
//RF35 Usuario selecciona plantilla. - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF35

const express = require('express');
const ruteador = express.Router();

const seleccionarPlantillaRuta = require('./seleccionarPlantilla.ruta');
const consultarTodasPlantillas = require('./consultarTodasPlantillas.ruta');
const consultarPlantillaCompleta = require('./consultarPlantillaCompleta.ruta');
const eliminarPlantillas = require('./eliminarPlantillas.ruta');
const guardarPlantilla = require('./guardarPlantillas.ruta');
const cargarPlantillaMejorada = require('./cargarPlantillaMejorada.ruta');
const plantillasSimplificadas = require('./plantillasSimplificadas.ruta');

ruteador.use('/seleccionar', seleccionarPlantillaRuta);
ruteador.use('/consultarTodas', consultarTodasPlantillas);
ruteador.use('/consultarCompleta', consultarPlantillaCompleta);
ruteador.use('/eliminar', eliminarPlantillas);
ruteador.use('/guardar', guardarPlantilla);
ruteador.use('/cargarMejorada', cargarPlantillaMejorada);
ruteador.use('/simplificadas', plantillasSimplificadas);

ruteador.get('/', (pet, res) => {
    res.status(200).json({
        mensaje: '¡Bienvenido a plantillas mejoradas TracTech!',
        caracteristicas: [
            'Captura completa de configuración de gráficas',
            'Información de fórmulas y parámetros',
            'Validación de compatibilidad de datos',
            'Trazabilidad completa de elementos',
            'Soporte para configuración avanzada'
        ],
        rutas: {
            '/seleccionar': 'Seleccionar plantilla (compatibilidad)',
            '/cargarMejorada/aplicar': 'Cargar y aplicar plantilla con funciones avanzadas',
            '/consultarTodas': 'Listar todas las plantillas',
            '/consultarCompleta': 'Consultar plantilla completa',
            '/guardar': 'Guardar nueva plantilla con información extendida',
            '/eliminar': 'Eliminar plantilla',
            '/simplificadas': 'Sistema de plantillas simplificado (estructura: idPlantilla, nombre, json)'
        }
    });
});

module.exports = ruteador;