const jwt = require('jsonwebtoken');
const conexion = require("../util/bd");

const verificarPermisos = (pet, res, siguiente) => {
    const idUsuario = pet.usuario.id; // Obtiene el ID del usuario desde el token decodificado

    try {
        const query = `CALL obtener_permisos_usuario(?)`; // Reemplaza con el nombre de tu stored procedure
        conexion.query(query, [idUsuario], (error, resultados) => {
            if (error) {
                console.error('Error al ejecutar el stored procedure:', error);
                return res.status(500).json({ message: "Error interno del servidor" });
            }

            pet.permisos = resultados[0]; // Asigna los permisos al objeto de solicitud

            // Continúa con el siguiente middleware
            siguiente();
        });
    } catch (error) {
        console.error('Error al verificar permisos:', error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}

module.exports = verificarPermisos;