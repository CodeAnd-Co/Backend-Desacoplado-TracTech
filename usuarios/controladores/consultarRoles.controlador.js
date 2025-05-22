// RF39: Administrador crea usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF39
const { consultarRoles } = require('../data/repositorios/consultarRolesRepositorio.js');

/**
 * Controlador para consultar todos los roles de usuarios
 * @param {object} peticion - Objeto de petición de Express
 * @param {object} respuesta - Objeto de respuesta de Express
 * @returns {object} Respuesta JSON con los roles o mensaje de error
 * @throws {Error} Error interno del servidor al procesar la petición
 */
exports.consultarRoles = async (peticion, respuesta) => {
  try {
    const roles = await consultarRoles();

    if (!roles || roles.length === 0) {
      return respuesta.status(404).json({
        mensaje: 'No se encontraron roles',
      });
    }
    if (roles && roles.status) {
      return respuesta.status(resultados.status).json({
        mensaje: resultados.mensaje,
      });
    }

    respuesta.status(200).json({
      mensaje: 'Consulta de roles exitosa',
      roles,
    });

  } catch (error) {
    console.error('Error al consultar roles:', error);
    respuesta.status(500).json({
      mensaje: 'Error interno del servidor',
    });
  }
};