// dispositivo/controladores/deshabilitarDispositivo.controlador.js

const DispositivoRepositorio = require('../data/repositorios/dispositivoRepositorio');
const DispositivoModelo = require('../data/modelos/dispositivoModelo');
const validator = require('validator');

/**
 * Controlador para deshabilitar un dispositivo
 */
exports.deshabilitarDispositivo = async (peticion, respuesta) => {
    try {
        if (!peticion.body) {
            return respuesta.status(400).json({ 
                mensaje: 'Faltan datos requeridos',
                exito: false 
            });
        }

        const { dispositivoId} = peticion.body;

        // Validar que se proporcione el ID del dispositivo
        if (!dispositivoId) {
            return respuesta.status(400).json({ 
                mensaje: 'El ID del dispositivo es requerido',
                exito: false 
            });
        }

        // Sanitizar los datos
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

        // Si el dispositivo no existe, devolver error
        if (!dispositivo) {
            return respuesta.status(404).json({ 
                mensaje: 'Dispositivo no encontrado',
                exito: false 
            });
        }        // Deshabilitar el dispositivo
        dispositivo = await DispositivoRepositorio.deshabilitar(dispositivoIdSanitizado, peticion.usuario || 'Sistema');
        if (!dispositivo) {
            return respuesta.status(500).json({ 
                mensaje: 'Error al deshabilitar el dispositivo',
                exito: false 
            });
        }

        respuesta.status(200).json({
            mensaje: 'Dispositivo deshabilitado exitosamente',
            exito: true,
            dispositivo: {
                id: dispositivo.id,
                estado: dispositivo.estado,
            }
        });

    } catch (error) {
        console.error('Error al deshabilitar dispositivo:', error);
        respuesta.status(500).json({ 
            mensaje: 'Error interno del servidor',
            exito: false 
        });
    }
};
