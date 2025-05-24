// RF43 Administrador elimina usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF43

const { eliminarUsuario: eliminarUsuarioRepositorio } = require('../data/repositorios/eliminarUsuarioRepositorio.js');

/**
 * Controlador para eliminar un usuario.
 *
 * Este controlador recibe una solicitud HTTP con el ID del usuario a eliminar 
 * y llama al repositorio correspondiente para ejecutar la eliminación. 
 * Retorna un mensaje de éxito si el usuario fue eliminado, 
 * o un error si no se encontró o si ocurrió un problema en el servidor.
 *
 * @async
 * @function eliminarUsuario
 * @param {Object} peticion - Objeto de solicitud HTTP de Express.
 * @param {Object} peticion.params - Parámetros de la ruta.
 * @param {string} peticion.params.id - ID del usuario a eliminar.
 * @param {Object} respuesta - Objeto de respuesta HTTP de Express.
 * @returns {void} No retorna ningún valor directamente; envía respuestas HTTP.
 */
exports.eliminarUsuario = async (peticion, respuesta) => {
    try {
        const { id } = peticion.params; // Obtener el ID del usuario a eliminar de los parámetros de la solicitud
    
        if (!id) {
            return respuesta.status(500).json({
                mensaje: 'No se ha proporcionado el ID del usuario',
            });
        }
    
        // Llamar al repositorio para eliminar el usuario
        const resultado = await eliminarUsuarioRepositorio(id);

        if (resultado && resultado.estado){
            return respuesta.status(resultado.estado).json({
                mensaje: resultado.mensaje,
            });
        }
    
        if (resultado) {
            respuesta.status(200).json({
                mensaje: 'Usuario eliminado exitosamente',
            });
        } 
    } catch (error) {
        if (error.estado && error.mensaje) {
            return respuesta.status(error.estado).json({
                mensaje: error.mensaje,
            });
        }
        respuesta.status(500).json({
            mensaje: 'Error interno del servidor',
        });
    }
};
