// dispositivo/controladores/verificarEstadoDispositivo.controlador.js

const consultarDispositivosRepositorio = require('../data/repositorios/consultarDispositivosRepositorio');
const registrarDispositivoRepositorio = require('../data/repositorios/registrarDispositivoRepositorio');
const vincularDispositivoRepositorio = require('../data/repositorios/vincularDispositivoRepositorio');
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
        const busquedaDispositivo = await consultarDispositivosRepositorio.obtenerPorId(dispositivoIdSanitizado);

        // Obtener el ID del usuario desde el token (si está autenticado)
        const idUsuario = peticion.usuario?.id || null;

        let dispositivoFinal = null;

        // Si hay un usuario autenticado, verificar restricciones de vinculación
        if (idUsuario) {
            // Verificar si el usuario ya tiene dispositivos vinculados
            const resultadoDispositivosUsuario = await consultarDispositivosRepositorio.obtenerDispositivosDeUsuario(idUsuario);
            
            if (busquedaDispositivo.estado === 200) {
                // El dispositivo existe
                const dispositivo = new DispositivoModelo(
                    busquedaDispositivo.datos.id,
                    busquedaDispositivo.datos.activo,
                    busquedaDispositivo.datos.idUsuario
                );

                if (dispositivo.estaVinculado()) {
                    // Si está vinculado a otro usuario, denegar acceso
                    if (!dispositivo.estaVinculadoA(idUsuario)) {
                        return respuesta.status(403).json({
                            mensaje: 'Este dispositivo pertenece a otro usuario',
                            estado: false,
                            codigo: 'DISPOSITIVO_AJENO'
                        });
                    }
                    dispositivoFinal = dispositivo;
                } else {
                    // El dispositivo no está vinculado, verificar si el usuario ya tiene otro dispositivo
                    if (resultadoDispositivosUsuario.estado === 200 && resultadoDispositivosUsuario.datos.length > 0) {
                        return respuesta.status(403).json({
                            mensaje: 'Ya tienes un dispositivo vinculado. Solo puedes usar un dispositivo por cuenta.',
                            estado: false,
                            codigo: 'MULTIPLES_DISPOSITIVOS'
                        });
                    }
                    
                    // Si el dispositivo está habilitado y el usuario no tiene otros dispositivos, vincular
                    if (dispositivo.estado) {
                        const resultadoVinculacion = await vincularDispositivoRepositorio.vincularDispositivo(dispositivoIdSanitizado, idUsuario);
                        if (resultadoVinculacion.estado === 200) {
                            dispositivoFinal = new DispositivoModelo(
                                resultadoVinculacion.datos.id,
                                resultadoVinculacion.datos.activo,
                                resultadoVinculacion.datos.idUsuario
                            );
                        } else {
                            dispositivoFinal = dispositivo;
                        }
                    } else {
                        dispositivoFinal = dispositivo;
                    }
                }
            } else {
                // El dispositivo no existe, verificar si el usuario ya tiene otro dispositivo
                if (resultadoDispositivosUsuario.estado === 200 && resultadoDispositivosUsuario.datos.length > 0) {
                    return respuesta.status(403).json({
                        mensaje: 'Ya tienes un dispositivo vinculado. Solo puedes usar un dispositivo por cuenta.',
                        estado: false,
                        codigo: 'MULTIPLES_DISPOSITIVOS'
                    });
                }
                
                // Registrar nuevo dispositivo y vincular al usuario
                const resultadoRegistro = await registrarDispositivoRepositorio.registrarOActualizar(dispositivoIdSanitizado, idUsuario);
                if (resultadoRegistro.estado === 201) {
                    dispositivoFinal = new DispositivoModelo(
                        resultadoRegistro.datos.id,
                        resultadoRegistro.datos.activo,
                        resultadoRegistro.datos.idUsuario
                    );
                } else {
                    return respuesta.status(resultadoRegistro.estado).json({
                        mensaje: resultadoRegistro.mensaje,
                        estado: false
                    });
                }
            }
        } else {
            // Usuario no autenticado, solo registrar dispositivo sin vinculación
            if (busquedaDispositivo.estado === 404) {
                const resultadoRegistro = await registrarDispositivoRepositorio.registrarOActualizar(dispositivoIdSanitizado, null);
                if (resultadoRegistro.estado === 201) {
                    dispositivoFinal = new DispositivoModelo(
                        resultadoRegistro.datos.id,
                        resultadoRegistro.datos.activo,
                        resultadoRegistro.datos.idUsuario
                    );
                } else {
                    return respuesta.status(resultadoRegistro.estado).json({
                        mensaje: resultadoRegistro.mensaje,
                        estado: false
                    });
                }
            } else if (busquedaDispositivo.estado === 200) {
                dispositivoFinal = new DispositivoModelo(
                    busquedaDispositivo.datos.id,
                    busquedaDispositivo.datos.activo,
                    busquedaDispositivo.datos.idUsuario
                );
            } else {
                return respuesta.status(busquedaDispositivo.estado).json({
                    mensaje: busquedaDispositivo.mensaje,
                    estado: false
                });
            }
        }

        // Devolver el estado del dispositivo
        respuesta.status(200).json({
            mensaje: dispositivoFinal.estado ? 'Dispositivo activo' : 'Dispositivo deshabilitado',
            estado: dispositivoFinal.estado,
            vinculado: dispositivoFinal.estaVinculado(),
            idUsuario: dispositivoFinal.idUsuario
        });

    } catch  {
        respuesta.status(500).json({ 
            mensaje: 'Error interno del servidor',
            estado: false 
        });
    }
};
