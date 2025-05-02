const conexion = require("../util/bd");

/**
 * Middleware para verificar los permisos de un usuario basándose en su ID obtenido del token JWT.
 * Llama a un procedimiento almacenado para recuperar los permisos del usuario y los adjunta a la petición.
 * 
  * @param {object} peticion - Objeto de solicitud (request) de Express
 * @param {object} respuesta - Objeto de respuesta (response) de Express
 * @param {function} siguiente - Función next() para pasar al siguiente middleware
 * @returns {void}
 * @throws {Error} Error 500 si hay problemas al verificar permisos
 */
const verificarPermisos = (peticion, respuesta, siguiente) => {
  // Obtiene el ID del usuario desde el objeto usuario (ya decodificado del token)
  const idUsuario = peticion.usuario.id;

  try {
    // Definir la consulta al procedimiento almacenado para obtener permisos
    const consulta = `CALL obtener_permisos_usuario(?)`; // Nombre del stored procedure

    // Ejecutar la consulta a la base de datos
    conexion.query(consulta, [idUsuario], (error, resultados) => {
      if (error) {
        // Si ocurre un error al ejecutar el stored procedure, retornar error 500
        console.error('Error al ejecutar el stored procedure:', error);
        return respuesta.status(500).json({ message: "Error interno del servidor" });
      }

      // Asignar los permisos obtenidos al objeto de solicitud
      peticion.permisos = resultados[0].map(resultado => resultado.permiso);

      // Llamar al siguiente middleware en la cadena
      siguiente();
    });
  } catch (error) {
    // Capturar cualquier error inesperado y devolver error 500
    console.error('Error al verificar permisos:', error);
    return respuesta.status(500).json({ message: "Error interno del servidor" });
  }
}

/**
 * Middleware para verificar si el usuario tiene un permiso específico
 * 
  * @param {string} permiso - El permiso que se requiere para acceder al recurso
 * @returns {function} Middleware que verifica si el usuario tiene el permiso requerido
 * @throws {Error} Error 404 si el usuario no tiene el permiso necesario
 */
const checarPermisos = (permiso) => {
    return (peticion, respuesta, siguiente) => {
    if (!peticion.permisos.includes(permiso)) {
      return respuesta.status(404).json({
        message: "Página no encontrada",
      });
    }
    siguiente();
  }
}

module.exports = { verificarPermisos, checarPermisos };
