// RF2 Usuario registrado inicia sesión - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF2
// RF3 Usuario cierra sesión - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF3

const { verify } = require('jsonwebtoken');
const listaNegra = require('./listaNegra');

/**
 * Middleware para verificar el token JWT en la cabecera de autorización.
 *
 * @param {import('express').Request} peticion - Objeto de solicitud HTTP.
 * @param {import('express').Response} respuesta - Objeto de respuesta HTTP.
 * @param {Function} siguiente - Función para continuar con el siguiente middleware.
 * @returns {json} Respuesta JSON con el mensaje de error o continúa con el siguiente middleware.
 */
const verificarToken = (peticion, respuesta, siguiente) => {
    let token = peticion.headers.authorization; // Obtiene el token desde la cabecera

    if (!token || !token.startsWith('Bearer ')) {
        return respuesta.status(401).json({ mensaje: 'Token no proporcionado' });
    }

    // Extrae el token eliminando el prefijo 'Bearer'
    token = token.split(' ')[1];

    // Verifica si el token está en la lista negra (revocado)
    // Lo que significa que el usuario ha cerrado sesión o el token ha sido invalidado
    if (listaNegra.has(token)) {
        return respuesta.status(401).json({ mensaje: 'Token inválido o sesión cerrada' });
    }

    // Verifica si el token es válido
    verify(token, process.env.SECRETO_JWT, (err, decodificado) => {
        if (err) {
            return respuesta.status(401).json({ mensaje: 'Token inválido o expirado' }); // Token incorrecto o caducado
        }

        peticion.usuario = decodificado; // Agrega los datos del usuario decodificados al request
        siguiente(); // Llama al siguiente middleware
    });
};

module.exports = verificarToken;
