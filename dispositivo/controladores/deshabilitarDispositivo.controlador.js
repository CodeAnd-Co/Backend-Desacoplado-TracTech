// dispositivo/controladores/deshabilitarDispositivo.controlador.js

const deshabilitarDispositivoRepositorio = require('../data/repositorios/deshabilitarDispositivoRepositorio');
const consultarDispositivosRepositorio = require('../data/repositorios/consultarDispositivosRepositorio');

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
        const resultadoDispositivos = await consultarDispositivosRepositorio.obtenerDispositivosDeUsuario(idUsuarioSanitizado);

        // Verificar si el usuario tiene dispositivos vinculados
        if (resultadoDispositivos.estado !== 200 || !resultadoDispositivos.datos || resultadoDispositivos.datos.length === 0) {
            return respuesta.status(404).json({ 
                mensaje: 'No se encontraron dispositivos vinculados a este usuario',
                exito: false 
            });
        }

        // Tomar el primer dispositivo activo (asumiendo un dispositivo por usuario)
        const dispositivoActivo = resultadoDispositivos.datos.find(dispositivo => dispositivo.activo === true);        
        if (!dispositivoActivo) {
            return respuesta.status(404).json({ 
                mensaje: 'El usuario no tiene dispositivos activos para deshabilitar',
                exito: false 
            });
        }

        // Deshabilitar el dispositivo
        const resultado = await deshabilitarDispositivoRepositorio.deshabilitar(dispositivoActivo.id);
        
        if (resultado.estado !== 200) {
            return respuesta.status(resultado.estado).json({ 
                mensaje: resultado.mensaje,
                exito: false 
            });
        }

        respuesta.status(200).json({
            mensaje: resultado.mensaje,
            exito: true,
            dispositivo: resultado.datos
        });

    } catch{
        respuesta.status(500).json({ 
            mensaje: 'Error interno del servidor',
            exito: false 
        });
    }
};
