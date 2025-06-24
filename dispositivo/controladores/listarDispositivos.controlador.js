// dispositivo/controladores/listarDispositivos.controlador.js

const DispositivoRepositorio = require('../data/repositorios/dispositivoRepositorio');

/**
 * Controlador para listar todos los dispositivos
 */
exports.listarDispositivos = async (peticion, respuesta) => {
    try {        // Obtener todos los dispositivos del repositorio
        const dispositivos = await DispositivoRepositorio.obtenerTodos();

        // Formatear la respuesta
        const dispositivosFormateados = dispositivos.map(dispositivo => ({
            id: dispositivo.id,
            estado: dispositivo.estado,
            metadata: dispositivo.metadata,
            idUsuario: dispositivo.idUsuario,
            nombreUsuario: dispositivo.nombreUsuario
        }));

        respuesta.status(200).json({
            mensaje: 'Dispositivos obtenidos exitosamente',
            total: dispositivosFormateados.length,
            dispositivos: dispositivosFormateados
        });
    } catch (error) {
        // Verificar si el error es relacionado con la conexión a la base de datos
        const esErrorDeConexion = error.message && (
            error.message.includes('Error al acceder a la base de datos')
            || error.message.includes('ECONNREFUSED')
            || error.message.includes('ETIMEDOUT')
            || error.message.includes('ENOTFOUND')
            || error.message.includes('Connection lost')
            || error.message.includes('connect ETIMEDOUT')
        );

        if (esErrorDeConexion) {
            respuesta.status(503).json({ 
                mensaje: 'Servicio temporalmente no disponible. Verifique su conexión a internet e intente nuevamente.',
                dispositivos: [],
                error: 'CONEXION_BD_FALLIDA'
            });
        } else {
            respuesta.status(500).json({ 
                mensaje: 'Error interno del servidor',
                dispositivos: [],
                error: 'ERROR_INTERNO'
            });
        }
    }
};
