// dispositivo/controladores/habilitarDispositivo.controlador.js

const DispositivoRepositorio = require('../data/repositorios/dispositivoRepositorio');
const DispositivoModelo = require('../data/modelos/dispositivoModelo');
const validator = require('validator');

/**
 * Controlador para habilitar un dispositivo
 */
exports.habilitarDispositivo = async (peticion, respuesta) => {
    try {
        if (!peticion.body) {
            return respuesta.status(400).json({ 
                mensaje: 'Faltan datos requeridos',
                exito: false 
            });
        }

        const { dispositivoId } = peticion.body;

        // Validar que se proporcione el ID del dispositivo
        if (!dispositivoId) {
            return respuesta.status(400).json({ 
                mensaje: 'El ID del dispositivo es requerido',
                exito: false 
            });
        }

        // Sanitizar el ID del dispositivo
        const dispositivoIdSanitizado = validator.escape(dispositivoId.toString());

        // Validar formato del ID
        if (!DispositivoModelo.validarId(dispositivoIdSanitizado)) {
            return respuesta.status(400).json({ 
                mensaje: 'ID de dispositivo inválido',
                exito: false 
            });
        }

        // Buscar el dispositivo
        let dispositivo = await DispositivoRepositorio.obtenerPorId(dispositivoIdSanitizado);
        // Si el dispositivo no existe, lo creamos y lo habilitamos
        if (!dispositivo) {
            dispositivo = await DispositivoRepositorio.registrarOActualizar(dispositivoIdSanitizado);
        } else {
            // Habilitar dispositivo existente
            dispositivo = await DispositivoRepositorio.habilitar(dispositivoIdSanitizado, peticion.usuario || 'Sistema');
        }

        if (!dispositivo) {
            return respuesta.status(404).json({ 
                mensaje: 'No se pudo procesar el dispositivo',
                exito: false 
            });
        }

        respuesta.status(200).json({
            mensaje: 'Dispositivo habilitado exitosamente',
            exito: true,
            dispositivo: {
                id: dispositivo.id,
                estado: dispositivo.estado,
            }
        });

    } catch (error) {
        console.error('Error al habilitar dispositivo:', error);
        respuesta.status(500).json({ 
            mensaje: 'Error interno del servidor',
            exito: false 
        });
    }
};
