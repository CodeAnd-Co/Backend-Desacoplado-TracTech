// dispositivo/controladores/consultarVinculacionDispositivos.controlador.js

const consultarDispositivosRepositorio = require('../data/repositorios/consultarDispositivosRepositorio');

/**
 * Controlador para consultar las vinculaciones entre dispositivos y usuarios
 */
exports.consultarVinculaciones = async (peticion, respuesta) => {
    try {
        // Obtener todas las vinculaciones
        const resultado = await consultarDispositivosRepositorio.obtenerVinculaciones();

        if (resultado.estado !== 200) {
            return respuesta.status(resultado.estado).json({
                mensaje: resultado.mensaje,
                vinculaciones: []
            });
        }

        // Formatear la respuesta
        const vinculacionesFormateadas = resultado.datos.map(vinculacion => ({
            dispositivo: {
                id: vinculacion.dispositivo.id,
                estado: vinculacion.dispositivo.activo,
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

    } catch {
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
        const { idUsuario } = peticion.params;        if (!idUsuario || isNaN(idUsuario)) {
            return respuesta.status(400).json({
                mensaje: 'ID de usuario inválido',
                dispositivos: []
            });
        }

        // Obtener dispositivos del usuario
        const resultado = await consultarDispositivosRepositorio.obtenerDispositivosDeUsuario(parseInt(idUsuario));

        if (resultado.estado !== 200) {
            return respuesta.status(resultado.estado).json({
                mensaje: resultado.mensaje,
                dispositivos: []
            });
        }

        // Formatear la respuesta
        const dispositivosFormateados = resultado.datos.map(dispositivo => ({
            id: dispositivo.id,
            estado: dispositivo.activo
        }));

        respuesta.status(200).json({
            mensaje: 'Dispositivos del usuario obtenidos exitosamente',
            idUsuario: parseInt(idUsuario),
            total: dispositivosFormateados.length,
            dispositivos: dispositivosFormateados
        });

    } catch {
        respuesta.status(500).json({ 
            mensaje: 'Error interno del servidor',
            dispositivos: []
        });
    }
};