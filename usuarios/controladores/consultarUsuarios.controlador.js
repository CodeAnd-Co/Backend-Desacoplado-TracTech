// RF40 Administrador consulta usuarios - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF40

const consultarUsuariosRepositorio = require('../data/repositorios/usuarios.repositorio.js');

/**
 * Controlador para consultar todos los usuarios
 * @param {object} peticion - Objeto de petición de Express
 * @param {object} respuesta - Objeto de respuesta de Express
 * @returns {object} Respuesta JSON con los usuarios o mensaje de error
 * @throws {Error} Error interno del servidor al procesar la petición
 */
exports.consultarUsuariosControlador = async (peticion, respuesta) => {
  try {
    const usuarios = await consultarUsuariosRepositorio();

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
