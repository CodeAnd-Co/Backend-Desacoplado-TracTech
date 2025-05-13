const conexion = require("../util/bd");

/**
 * Middleware para obtener información del usuario basándose en su ID obtenido del token JWT.
 * Consulta la base de datos para recuperar el nombre del usuario y lo adjunta a la petición.
 * 
 * @param {object} peticion - Objeto de solicitud (request) de Express
 * @param {object} respuesta - Objeto de respuesta (response) de Express
 * @param {function} siguiente - Función next() para pasar al siguiente middleware
 * @returns {void}
 * @throws {Error} Error 500 si hay problemas al obtener información del usuario
 */
const obtenerNombreUsuario = (peticion, respuesta, siguiente) => {
  // Obtiene el ID del usuario desde el objeto usuario (ya decodificado del token)
  const idUsuario = peticion.usuario.id;

  try {
    // Definir la consulta SQL para obtener el nombre del usuario
    const consulta = `SELECT Nombre FROM usuario WHERE idUsuario = ?`;

    // Ejecutar la consulta a la base de datos
    conexion.query(consulta, [idUsuario], (error, resultados) => {
      if (error) {
        // Si ocurre un error al ejecutar la consulta, retornar error 500
        console.error('Error al consultar información del usuario:', error);
        return respuesta.status(500).json({ mensaje: "Error interno del servidor" });
      }

      // Verificar si se encontró el usuario
      if (resultados.length === 0) {
        console.error('Usuario no encontrado con ID:', idUsuario);
        return respuesta.status(404).json({ mensaje: "Usuario no encontrado" });
      }

      // Asignar la información obtenida al objeto de solicitud
      peticion.usuario = resultados[0].Nombre;

      // Llamar al siguiente middleware en la cadena
      siguiente();
    });
  } catch (error) {
    // Capturar cualquier error inesperado y devolver error 500
    console.error('Error al obtener información del usuario:', error);
    return respuesta.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

module.exports = { obtenerNombreUsuario };