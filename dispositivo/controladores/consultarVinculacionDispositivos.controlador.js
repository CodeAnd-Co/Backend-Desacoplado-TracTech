// dispositivo/controladores/consultarVinculacionDispositivos.controlador.js

const DispositivoRepositorio = require('../data/repositorios/dispositivoRepositorio');

/**
 * Controlador para consultar las vinculaciones entre dispositivos y usuarios
 */
exports.consultarVinculaciones = async (peticion, respuesta) => {
    try {
        // Obtener todas las vinculaciones
        const vinculaciones = await DispositivoRepositorio.obtenerVinculaciones();
        console.log('Vinculaciones obtenidas:', vinculaciones);

        // Formatear la respuesta
        const vinculacionesFormateadas = vinculaciones.map(vinculacion => ({
            dispositivo: {
                id: vinculacion.dispositivo.id,
                estado: vinculacion.dispositivo.estado,
            },
            usuario: vinculacion.usuario ? {
                id: vinculacion.usuario.id,
                nombre: vinculacion.usuario.nombre,
                correo: vinculacion.usuario.correo
            } : null,
            estaVinculado: vinculacion.usuario !== null
        }));

        respuesta.status(200).json({
            mensaje: 'Vinculaciones obtenidas exitosamente',
            total: vinculacionesFormateadas.length,
            vinculaciones: vinculacionesFormateadas
        });

    } catch (error) {
        console.error('Error al consultar vinculaciones:', error);
        respuesta.status(500).json({ 
            mensaje: 'Error interno del servidor',
            vinculaciones: []
        });
    }
};

/**
 * Controlador para consultar dispositivos de un usuario específico
 */
exports.consultarDispositivosDeUsuario = async (peticion, respuesta) => {
    try {
        const { idUsuario } = peticion.params;

        if (!idUsuario || isNaN(idUsuario)) {
            return respuesta.status(400).json({
                mensaje: 'ID de usuario inválido',
                dispositivos: []
            });
        }

        // Obtener dispositivos del usuario
        const dispositivos = await DispositivoRepositorio.obtenerDispositivosDeUsuario(parseInt(idUsuario));

        // Formatear la respuesta
        const dispositivosFormateados = dispositivos.map(dispositivo => ({
            id: dispositivo.id,
            estado: dispositivo.estado
        }));

        respuesta.status(200).json({
            mensaje: 'Dispositivos del usuario obtenidos exitosamente',
            idUsuario: parseInt(idUsuario),
            total: dispositivosFormateados.length,
            dispositivos: dispositivosFormateados
        });

    } catch (error) {
        console.error('Error al consultar dispositivos del usuario:', error);
        respuesta.status(500).json({ 
            mensaje: 'Error interno del servidor',
            dispositivos: []
        });
    }
};