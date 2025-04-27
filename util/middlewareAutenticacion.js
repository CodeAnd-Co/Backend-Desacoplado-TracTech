const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar el token JWT en la cabecera de autorización.
 *
 * @param {import('express').Request} pet - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @param {Function} siguiente - Función para continuar con el siguiente middleware.
 * @returns {void}
 */
const verificarToken = (pet, res, siguiente) => {
    let token = pet.headers['authorization']; // Obtiene el token desde la cabecera

    if (!token) {
        return res.status(403).json({ message: "Token no proporcionado" }); // Sin token: acceso prohibido
    }
    // Extrae el token eliminando el prefijo "Bearer"
    token = token.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: "Token no proporcionado" });
    }

    // Verifica si el token es válido
    jwt.verify(token, process.env.SECRETO_JWT, (err, decodificado) => {
        if (err) {
            return res.status(401).json({ message: "Token inválido o expirado" }); // Token incorrecto o caducado
        }

        pet.usuario = decodificado; // Agrega los datos del usuario decodificados al request
        siguiente(); // Llama al siguiente middleware
    });
};

module.exports = verificarToken;
