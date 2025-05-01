// RF2 Usuario registrado inicia sesión - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF2
// RF3 Usuario cierra sesión - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF3

const jwt = require('jsonwebtoken');
const listaNegra = require('./listaNegra');

/**
 * Middleware para verificar el token JWT en la cabecera de autorización.
 *
 * @param {import('express').Request} pet - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @param {Function} siguiente - Función para continuar con el siguiente middleware.
 * @returns {void}
 */
const verificarToken = (pet, res, siguiente) => {
    let token = pet.headers.authorization; // Obtiene el token desde la cabecera

    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' }); // Sin token: acceso prohibido
    }
    // Extrae el token eliminando el prefijo 'Bearer'
    token = token.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

    // Verifica si el token está en la lista negra (revocado)
    // Lo que significa que el usuario ha cerrado sesión o el token ha sido invalidado
    if (listaNegra.has(token)) {
        return res.status(401).json({ mensaje: 'Token inválido o sesión cerrada' });
    }

    // Verifica si el token es válido
    jwt.verify(token, process.env.SECRETO_JWT, (err, decodificado) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido o expirado' }); // Token incorrecto o caducado
        }

        pet.usuario = decodificado; // Agrega los datos del usuario decodificados al request
        siguiente(); // Llama al siguiente middleware
    });
};

module.exports = verificarToken;
