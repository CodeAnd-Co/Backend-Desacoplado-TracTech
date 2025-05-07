// RF39: Administrador crea usuario - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF39
const { consultarRoles: consultarRolesRepositorio } = require('../data/repositorios/usuarios.repositorio.js');

/**
 * Controlador para consultar todos los roles de usuarios
 * @param {object} peticion - Objeto de petición de Express
 * @param {object} respuesta - Objeto de respuesta de Express
 * @returns {object} Respuesta JSON con los roles o mensaje de error
 * @throws {Error} Error interno del servidor al procesar la petición
 */
exports.consultarRoles = async (peticion, respuesta) => {
  console.log('Entrando a consultarRoles...');
  try {
    const roles = await consultarRolesRepositorio();

    if (!roles || roles.length === 0) {
      return respuesta.status(404).json({
        message: 'No se encontraron roles',
      });
    }

    respuesta.status(200).json({
      message: 'Consulta de roles exitosa',
      roles,
    });

  } catch (error) {
    console.error('Error al consultar roles:', error);
    respuesta.status(500).json({
      message: 'Error interno del servidor',
    });
  }
};