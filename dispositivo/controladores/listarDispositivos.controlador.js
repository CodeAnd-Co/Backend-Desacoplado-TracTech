// dispositivo/controladores/listarDispositivos.controlador.js

const DispositivoRepositorio = require('../data/repositorios/dispositivoRepositorio');

/**
 * Controlador para listar todos los dispositivos
 */
exports.listarDispositivos = async (peticion, respuesta) => {
    try {
        // Obtener todos los dispositivos del repositorio
        const dispositivos = await DispositivoRepositorio.obtenerTodos();

        // Formatear la respuesta
        const dispositivosFormateados = dispositivos.map(dispositivo => ({
            id: dispositivo.id,
            estado: dispositivo.estado,
            fechaRegistro: dispositivo.fechaRegistro,
            fechaUltimaActividad: dispositivo.fechaUltimaActividad,
            metadata: dispositivo.metadata
        }));

        respuesta.status(200).json({
            mensaje: 'Dispositivos obtenidos exitosamente',
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
