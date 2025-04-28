const jwt = require('jsonwebtoken');
const conexion = require("../util/bd");

const verificarPermisos = (pet, res, siguiente) => {
    console.log("si", pet.usuario)
    const idUsuario = pet.usuario.idUsuario; // Obtiene el ID del usuario desde el token decodificado

    try {
        const query = `CALL nombre_del_stored_procedure(?)`; // Reemplaza con el nombre de tu stored procedure
        conexion.query(query, [idUsuario], (error, resultados) => {
            if (error) {
                console.error('Error al ejecutar el stored procedure:', error);
                return res.status(500).json({ message: "Error interno del servidor" });
            }

            // Procesa los resultados del stored procedure
            console.log('Resultados del stored procedure:', resultados);

            // Continúa con el siguiente middleware
            siguiente();
        });
    } catch (error) {
        console.error('Error al verificar permisos:', error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}

module.exports = {
    verificarPermisos,
};