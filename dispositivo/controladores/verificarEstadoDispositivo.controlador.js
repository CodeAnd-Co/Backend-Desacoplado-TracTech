// dispositivo/controladores/verificarEstadoDispositivo.controlador.js

const DispositivoRepositorio = require('../data/repositorios/dispositivoRepositorio');
const DispositivoModelo = require('../data/modelos/dispositivoModelo');
const validator = require('validator');

/**
 * Controlador para verificar el estado de un dispositivo
 */
exports.verificarEstado = async (peticion, respuesta) => {
    try {
        if (!peticion.body) {
            return respuesta.status(400).json({ 
                mensaje: 'Faltan datos requeridos',
                estado: false 
            });
        }

        const { dispositivoId } = peticion.body;

        // Validar que se proporcione el ID del dispositivo
        if (!dispositivoId) {
            return respuesta.status(400).json({ 
                mensaje: 'El ID del dispositivo es requerido',
                estado: false 
            });
        }

        // Sanitizar el ID del dispositivo
        const dispositivoIdSanitizado = validator.escape(dispositivoId.toString());

        // Validar formato del ID
        if (!DispositivoModelo.validarId(dispositivoIdSanitizado)) {
            return respuesta.status(400).json({ 
                mensaje: 'ID de dispositivo inválido',
                estado: false 
            });
        }        // Buscar el dispositivo en el repositorio
        let dispositivo = await DispositivoRepositorio.obtenerPorId(dispositivoIdSanitizado);
        console.log('Dispositivo encontrado:', dispositivo);

        // Si el dispositivo no existe, lo registramos como nuevo y activo
        if (!dispositivo) {
            dispositivo = await DispositivoRepositorio.registrarOActualizar(dispositivoIdSanitizado);
        }
        // Si existe, solo verificamos su estado actual (no lo modificamos)

        // Devolver el estado del dispositivo
        respuesta.status(200).json({
            mensaje: dispositivo.estado ? 'Dispositivo activo' : 'Dispositivo deshabilitado',
            estado: dispositivo.estado,
        });

    } catch (error) {
        console.error('Error al verificar estado del dispositivo:', error);
        respuesta.status(500).json({ 
            mensaje: 'Error interno del servidor',
            estado: false 
        });
    }
};
