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
        }

        // Buscar el dispositivo en el repositorio
        let dispositivo = await DispositivoRepositorio.obtenerPorId(dispositivoIdSanitizado);

        // Obtener el ID del usuario desde el token (si está autenticado)
        const idUsuario = peticion.usuario?.id || null;

        // Si hay un usuario autenticado, verificar restricciones de vinculación
        if (idUsuario) {
            // Verificar si el usuario ya tiene dispositivos vinculados
            const dispositivosUsuario = await DispositivoRepositorio.obtenerDispositivosDeUsuario(idUsuario);
            
            if (dispositivo) {
                // El dispositivo existe
                if (dispositivo.estaVinculado()) {
                    // Si está vinculado a otro usuario, denegar acceso
                    if (!dispositivo.estaVinculadoA(idUsuario)) {
                        return respuesta.status(403).json({
                            mensaje: 'Este dispositivo pertenece a otro usuario',
                            estado: false,
                            codigo: 'DISPOSITIVO_AJENO'
                        });
                    }
                } else {
                    // El dispositivo no está vinculado, verificar si el usuario ya tiene otro dispositivo
                    if (dispositivosUsuario.length > 0) {
                        return respuesta.status(403).json({
                            mensaje: 'Ya tienes un dispositivo vinculado. Solo puedes usar un dispositivo por cuenta.',
                            estado: false,
                            codigo: 'MULTIPLES_DISPOSITIVOS'
                        });
                    }
                    
                    // Si el dispositivo está habilitado y el usuario no tiene otros dispositivos, vincular
                    if (dispositivo.estado) {
                        dispositivo = await DispositivoRepositorio.vincularDispositivo(dispositivoIdSanitizado, idUsuario);
                    }
                }
            } else {
                // El dispositivo no existe, verificar si el usuario ya tiene otro dispositivo
                if (dispositivosUsuario.length > 0) {
                    return respuesta.status(403).json({
                        mensaje: 'Ya tienes un dispositivo vinculado. Solo puedes usar un dispositivo por cuenta.',
                        estado: false,
                        codigo: 'MULTIPLES_DISPOSITIVOS'
                    });
                }
                
                // Registrar nuevo dispositivo y vincular al usuario
                dispositivo = await DispositivoRepositorio.registrarOActualizar(dispositivoIdSanitizado, idUsuario);
            }
        } else {
            // Usuario no autenticado, solo registrar dispositivo sin vinculación
            if (!dispositivo) {
                dispositivo = await DispositivoRepositorio.registrarOActualizar(dispositivoIdSanitizado, null);
            }
        }

        // Devolver el estado del dispositivo
        respuesta.status(200).json({
            mensaje: dispositivo.estado ? 'Dispositivo activo' : 'Dispositivo deshabilitado',
            estado: dispositivo.estado,
            vinculado: dispositivo.estaVinculado(),
            idUsuario: dispositivo.idUsuario
        });

    } catch  {
        respuesta.status(500).json({ 
            mensaje: 'Error interno del servidor',
            estado: false 
        });
    }
};
