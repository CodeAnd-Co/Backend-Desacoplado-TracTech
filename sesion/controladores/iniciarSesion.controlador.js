// RF2 Usuario registrado inicia sesión - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF2

// sesion/controladores/iniciarSesion.controlador.js
const {generarToken} = require('../../util/servicios/generarToken');

const validador = require('validator');
const repo = require('../data/repositorios/obtenerUsuarioRepositorio');

/**
 * Controlador para iniciar sesión.
 * Valida los datos de entrada, verifica las credenciales del usuario y genera un token JWT si son válidas.
 * @param {object} peticion - Objeto de la petición (request) que contiene los datos del usuario
 * @param {object} respuesta - Objeto de la respuesta (response) para enviar el resultado al cliente
 * @return {json} Respuesta JSON con el mensaje de éxito o error
 */
exports.iniciarSesion = async (peticion, respuesta) => {
    if (!peticion.body) {
        return respuesta.status(400).json({ mensaje: 'Faltan datos requeridos' });
    }
    const { correo, contrasenia } = peticion.body;
    if (!correo || !contrasenia) {
        return respuesta.status(400).json({ mensaje: 'Faltan datos requeridos' });
    }
    if (!validador.isEmail(correo)) {
        return respuesta.status(400).json({ mensaje: 'Correo inválido' });
    }
    const correoSanitizado = validador.normalizeEmail(correo);
    const contraseniaSanitizada = validador.escape(contrasenia);

    try {
        const usuario = await repo.obtenerUsuarioSiValido(correoSanitizado, contraseniaSanitizada);
        if (!usuario) {
            return respuesta.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
        }
        const token = generarToken(usuario);
        respuesta.status(200).json({ mensaje: 'Usuario inició sesión con éxito', token });
    } catch  {
        respuesta.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};
