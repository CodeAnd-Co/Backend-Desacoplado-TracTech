const conexion = require("../util/bd");

/**
 * Middleware para verificar los permisos de un usuario basándose en su ID obtenido del token JWT.
 * Llama a un procedimiento almacenado para recuperar los permisos del usuario y los adjunta a la petición.
 * 
 * @param {object} pet - Objeto de solicitud (request) de Express
 * @param {object} res - Objeto de respuesta (response) de Express
 * @param {function} siguiente - Función next() para pasar al siguiente middleware
 */
const verificarPermisos = (pet, res, siguiente) => {
    // Obtiene el ID del usuario desde el objeto usuario (ya decodificado del token)
    const idUsuario = pet.usuario.id;

    try {
        // Definir la consulta al procedimiento almacenado para obtener permisos
        const consulta = `CALL obtener_permisos_usuario(?)`; // Nombre del stored procedure

        // Ejecutar la consulta a la base de datos
        conexion.query(consulta, [idUsuario], (error, resultados) => {
            if (error) {
                // Si ocurre un error al ejecutar el stored procedure, retornar error 500
                console.error('Error al ejecutar el stored procedure:', error);
                return res.status(500).json({ message: "Error interno del servidor" });
            }

            // Asignar los permisos obtenidos al objeto de solicitud
            pet.permisos = resultados[0];

            // Llamar al siguiente middleware en la cadena
            siguiente();
        });
    } catch (error) {
        // Capturar cualquier error inesperado y devolver error 500
        console.error('Error al verificar permisos:', error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}

module.exports = verificarPermisos;
