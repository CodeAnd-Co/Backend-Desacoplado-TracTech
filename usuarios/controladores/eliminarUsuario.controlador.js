// RF43 Administrador elimina usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF43

const { eliminarUsuario: eliminarUsuarioRepositorio } = require('../data/repositorios/usuarios.repositorio.js');

exports.eliminarUsuario = async (peticion, respuesta) => {
    try {
        const { id } = peticion.params; // Obtener el ID del usuario a eliminar de los parámetros de la solicitud
    
        if (!id) {
        return respuesta.status(500).json({
            mensaje: 'Error interno del servidor',
        });
        }
    
        // Llamar al repositorio para eliminar el usuario
        const resultado = await eliminarUsuarioRepositorio(id);
    
        if (resultado) {
        respuesta.status(200).json({
            mensaje: 'Usuario eliminado exitosamente',
        });
        } else {
        respuesta.status(404).json({
            mensaje: 'Usuario no encontrado',
        });
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        respuesta.status(500).json({
        mensaje: 'Error interno del servidor',
        });
    }
}