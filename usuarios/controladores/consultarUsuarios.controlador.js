// RF40 Administrador consulta usuarios - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF40

const { consultarUsuarios: consultarUsuariosRepositorio } = require('../data/repositorios/consultarUsuariosRepositorio');

/**
 * Controlador para consultar todos los usuarios
 * @param {object} peticion - Objeto de petición de Express
 * @param {object} respuesta - Objeto de respuesta de Express
 * @returns {object} Respuesta JSON con los usuarios o mensaje de error
 * @throws {Error} Error interno del servidor al procesar la petición
 */
exports.consultarUsuarios = async (peticion, respuesta) => {
  try {
    const usuarios = await consultarUsuariosRepositorio();

    if (!usuarios || usuarios.length === 0) {
      return respuesta.status(404).json({
        mensaje: 'No se encontraron usuarios',
      });
    }
  
    respuesta.status(200).json({
      mensaje: 'Consulta de usuarios exitosa',
      usuarios,
    });
    
  } catch {
    respuesta.status(500).json({
      mensaje: 'Error interno del servidor',
    });
  }
}
