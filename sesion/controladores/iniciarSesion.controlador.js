// sesion/controladores/iniciarSesion.controlador.js
const jwt = require('jsonwebtoken');
const validador = require('validator');
const repo = require('../data/repositorios/sesionRepositorio');

exports.iniciarSesion = async (peticion, respuesta) => {
    const { correo, contrasenia } = peticion.body;
    if (!correo || !contrasenia) {
        return respuesta.status(400).json({ mensaje: 'Faltan datos requeridos' });
    }
    if (!validarCorreo(correo)) {
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
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        respuesta.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

function generarToken(usuario) {
    return jwt.sign(
        { id: usuario.idUsuario, correo: usuario.Correo },
        process.env.SECRETO_JWT,
        { expiresIn: process.env.DURACION_JWT }
    );
}

function validarCorreo(correo) {
    const regex = /^[a-z0-9!#$%&'*+?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    return regex.test(correo);
}