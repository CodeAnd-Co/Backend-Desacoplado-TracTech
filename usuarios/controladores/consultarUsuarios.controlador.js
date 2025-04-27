const consultarUsuariosRepositorio = require('../data/repositorios/usuarios.repositorio.js');

exports.consultarUsuariosControlador = async (peticion, respuesta) => {

    try {
        const usuarios = await consultarUsuariosRepositorio.consultarUsuarios();

        if (!usuarios || usuarios.length === 0) {
            return respuesta.status(404).json({
                message: "No se encontraron usuarios",
            });
        }
    
        respuesta.status(200).json({
            message: "Consulta de usuarios exitosa",
            usuarios,
        });
        
    } catch (error) {
        console.error('Error al consultar usuarios:', error);
        respuesta.status(500).json({
            message: "Error interno del servidor",
        });
    }

}
