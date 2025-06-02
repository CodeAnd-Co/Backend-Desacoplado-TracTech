// dispositivo/controladores/deshabilitarDispositivo.controlador.js

const DispositivoRepositorio = require('../data/repositorios/dispositivoRepositorio');

/**
 * Controlador para deshabilitar dispositivo vinculado a un usuario
 */
exports.deshabilitarDispositivo = async (peticion, respuesta) => {
    try {
        if (!peticion.body) {
            return respuesta.status(400).json({ 
                mensaje: 'Faltan datos requeridos',
                exito: false 
            });
        }

        const { idUsuario } = peticion.body;

        // Validar que se proporcione el ID del usuario
        if (!idUsuario) {
            return respuesta.status(400).json({ 
                mensaje: 'El ID del usuario es requerido',
                exito: false 
            });
        }

        // Sanitizar y validar el ID del usuario
        const idUsuarioSanitizado = parseInt(idUsuario);
        if (isNaN(idUsuarioSanitizado) || idUsuarioSanitizado <= 0) {
            return respuesta.status(400).json({ 
                mensaje: 'ID de usuario inválido',
                exito: false 
            });
        }

        // Buscar los dispositivos vinculados al usuario
        const dispositivos = await DispositivoRepositorio.obtenerDispositivosDeUsuario(idUsuarioSanitizado);

        // Verificar si el usuario tiene dispositivos vinculados
        if (!dispositivos || dispositivos.length === 0) {
            return respuesta.status(404).json({ 
                mensaje: 'No se encontraron dispositivos vinculados a este usuario',
                exito: false 
            });
        }

        // Tomar el primer dispositivo activo (asumiendo un dispositivo por usuario)
        const dispositivoActivo = dispositivos.find(dispositivo => dispositivo.estado === true);
        
        if (!dispositivoActivo) {
            return respuesta.status(404).json({ 
                mensaje: 'El usuario no tiene dispositivos activos para deshabilitar',
                exito: false 
            });
        }

        // Deshabilitar el dispositivo
        const dispositivoDeshabilitado = await DispositivoRepositorio.deshabilitar(dispositivoActivo.id);
        if (!dispositivoDeshabilitado) {
            return respuesta.status(500).json({ 
                mensaje: 'Error al deshabilitar el dispositivo',
                exito: false 
            });
        }        respuesta.status(200).json({
            mensaje: 'Dispositivo deshabilitado y desvinculado exitosamente',
            exito: true,
            dispositivo: {
                id: dispositivoDeshabilitado.id,
                estado: dispositivoDeshabilitado.estado,
                idUsuario: null // Ahora está desvinculado
            }
        });

    } catch{
        respuesta.status(500).json({ 
            mensaje: 'Error interno del servidor',
            exito: false 
        });
    }
};
