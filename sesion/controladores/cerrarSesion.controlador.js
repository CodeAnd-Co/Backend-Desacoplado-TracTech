// RF3 Usuario cierra sesión - https://codeandco-wiki.netlify.app/docs/proyectos/tractores/documentacion/requisitos/RF3

const listaNegra = require('../../util/listaNegra'); // Importar la lista negra para almacenar tokens revocados temporalmente

/**
 * Controlador para cerrar sesión.
 * Agrega el token del usuario a la lista negra para invalidarlo en futuras solicitudes.
 * @param {object} pet - Objeto de la petición (request) que contiene los encabezados
 * @param {object} res - Objeto de la respuesta (response) para enviar el resultado al cliente
 */
exports.cerrarSesion = (pet, res) => {
    try {
        // Obtener el token del encabezado Authorization
        const token = pet.headers.authorization?.split(' ')[1];

        // Validar si se proporcionó un token
        if (!token) {
            return res.status(400).json({ mensaje: 'Token no proporcionado' });
        }

        // Agregar el token a la lista negra para revocarlo
        listaNegra.add(token);

        // Responder exitosamente que la sesión fue cerrada
        return res.status(200).json({ mensaje: 'Sesión cerrada correctamente' });
    } catch (error) {
        console.error('Error al cerrar sesión:', error);

        // Responder con error interno en caso de fallo
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};
