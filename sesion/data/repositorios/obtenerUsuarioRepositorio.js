// RF2 Usuario registrado inicia sesión - https://codeandco-wiki.netlify.app/docs/next/proyectos/tractores/documentacion/requisitos/RF2

// sesion/data/repositorios/sesionRepositorio.js
const bcrypt = require('bcrypt');
const modelo = require('../modelos/obtenerUsuarioPorCorreoModelo.js');

async function obtenerUsuarioSiValido(correo, contrasenia) {
    if (!correo || !contrasenia) return {
        mensaje: 'Faltan datos requeridos',
        estado: 400,
    };
    const usuarios = await modelo.obtenerUsuarioPorCorreo(correo);
    if (usuarios.length === 0) return null;
    const usuario = usuarios[0];
    const contraseniaValida = await bcrypt.compare(contrasenia, usuario.Contrasenia);
    if (!contraseniaValida) return null;
    return usuario;
}

module.exports = {
    obtenerUsuarioSiValido,
};